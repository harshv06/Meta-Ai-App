import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import useKeyboardHeightOffset from "../helpers/useKeyboardHeightOffset";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import uuid from "react-native-uuid";
import EventSource from "react-native-sse";
import * as fs from "expo-file-system";
import {
  addMessage,
  AssistantMessage,
  changeMessageStatus,
  createNewChat,
  markMessageAsRead,
  saveMessages,
  saveNewChat,
  saveUpdatedChatSummary,
  updateAssistantMessage,
  updateChatSummary,
} from "../redux/reducers/chatReducer";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const SendButton = ({
  isTyping,
  setisTyping,
  length,
  messages,
  heightOfMessageBox,
  setHeightOfMessageBox,
  currentChatId,
  setCurrentChatId,
}) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const keyboardOffsetHeight = useKeyboardHeightOffset();
  const currChatId = useSelector((state) => state.chat.currentChatId);
  const TextInputRef = useRef(null);
  const animationValue = useRef(new Animated.Value(0)).current;
  const chats = useSelector((state) => state.chat.chats);

  const handleTextChange = (text) => {
    setisTyping(!!text);
    setMessage(text);
  };

  const handleContentSizeChange = (e) => {
    setHeightOfMessageBox(e.nativeEvent.contentSize.height);
  };

  const checkImage = async (message) => {
    const imageRegex = /\b(generate\s*image|imagine|draw|picture)\b/i;
    if (imageRegex.test(message)) {
      // console.log("Returning True");
      return true;
    }
    // console.log("Returning False");
    return false;
  };

  const fetchTextResponse = async (prompt, currChatId) => {
    let id = uuid.v4();
    await dispatch(
      addMessage({
        chatid: currChatId,
        message: {
          content: "",
          time: prompt.time,
          role: "assistant",
          id: id,
          isLoading: true,
        },
      })
    );
    console.log("reaching here");
    const Event = new EventSource(process.env.HUGGING_FACE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API}`,
        "Content-Type": "application/json",
      },
      pollingInterval: 0,
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [
          {
            role: "user",
            content: prompt.content,
          },
        ],
        max_token: 500,
        stream: true,
      }),
    });

    let contents = "";
    let responseComplete = false;

    Event.addEventListener("message", (event) => {
      if (event.data !== "[DONE]") {
        console.log("Getting here");
        const parsedData = JSON.parse(event.data);
        if (parsedData.choices && parsedData.choices.length > 0) {
          const delta = parsedData.choices[0].delta.content;
          if (delta) {
            contents += delta;
            dispatch(
              updateAssistantMessage({
                message: {
                  content: contents,
                  time: new Date().toString(),
                  role: "assistant",
                  id: id,
                },
                chatid: currChatId,
                messageid: id,
              })
            );
          }
        }
      } else {
        responseComplete = true;
        Event.close();
      }
    });

    Event.addEventListener("error", (error) => {
      console.error("EventSource error:", error);
      dispatch(
        updateAssistantMessage({
          message: {
            contents: "Oops something went wrong",
            time: new Date().toString(),
            role: "assistant",
            id: id,
          },
          chatid: currChatId,
          messageid: id,
        })
      );
      Event.close();
    });

    Event.addEventListener("close", () => {
      if (!responseComplete) {
        Event.close();
      }
    });
    return () => {
      Event.removeAllEventListeners();
      Event.close();
    };
  };

  const fetchImageResponse = async (prompt, currChatId) => {
    let fileUri = "";
    let id = uuid.v4();
    await dispatch(
      addMessage({
        chatid: currChatId,
        message: {
          content: "",
          time: prompt.time,
          role: "assistant",
          id: id,
          isLoading: true,
        },
      })
    );

    try {
      const form = new FormData();
      form.append("prompt", prompt.content);

      const response = await fetch(process.env.TEXT_TO_IMAGE_URL, {
        method: "POST",
        headers: {
          "x-api-key": `${process.env.TEXT_TO_IMAGE_API}`, // Replace with your API key
        },
        body: form,
      });
      if (response.ok) {
        const blob = await response.blob();
        fileUri = `${fs.cacheDirectory}generated-image.png`;

        // Save the image to cache directory
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result.split(",")[1]; // Extract base64 data
          await fs.writeAsStringAsync(fileUri, base64Data, {
            encoding: fs.EncodingType.Base64,
          });
          // setImageUri(fileUri); // Set image URI
        };
        reader.readAsDataURL(blob); // Convert blob to base64
      }

      await dispatch(
        updateAssistantMessage({
          chatid: currChatId,
          messageid: id,
          message: {
            // content: fileUri,
            imageUri: fileUri,
            time: new Date().toString(),
            role: "assistant",
            id: id,
          },
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const addMessages = async (Id) => {
    console.log("Add Message", message);
    let selectedId = Id ? Id : currChatId;
    if (length == 0 && message.trim().length != 0) {
      await dispatch(
        updateChatSummary({
          chatid: selectedId,
          summary: message?.trim().slice(0, 40),
          // message:message
        })
      );
    }

    let uuid4 = uuid.v4();

    await dispatch(
      addMessage({
        chatid: selectedId,
        message: {
          content: message,
          time: new Date().toString(),
          role: "user",
          id: uuid4,
          isMessageRead: false,
        },
      })
    );
    console.log("Message Saved");
    setMessage("");
    TextInputRef.current.blur();
    setisTyping(false);

    let prompt = {
      content: message,
      time: new Date().toString(),
      role: "user",
      id: uuid4,
      isMessageRead: false,
    };

    console.log(checkImage(message));
    if (!checkImage(message)) {
      // console.log("Text1",message);
      fetchImageResponse(prompt, selectedId);
    } else {
      console.log("Text", message);
      fetchTextResponse(prompt, selectedId);
    }

    await dispatch(
      markMessageAsRead({ chatId: selectedId, messageId: uuid4 })
    );
  };

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: isTyping ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isTyping]);

  const sendButtonStyle = {
    opacity: animationValue,
    transform: [
      {
        scale: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        }),
      },
    ],
  };

  return (
    <View
      style={[
        styles.container,
        {
          bottom:
            Platform.OS == "android"
              ? height * 0.02
              : Math.max(keyboardOffsetHeight, height * 0.02),
        },
      ]}
    >
      <View style={styles.subContainer}>
        <View
          style={[styles.inputContainer, { width: isTyping ? "86%" : "100%" }]}
        >
          <TextInput
            editable
            multiline
            placeholder="Type a message"
            placeholderTextColor="gray"
            style={styles.inputBox}
            value={message}
            onChangeText={(text) => handleTextChange(text)}
            keyboardAppearance="dark"
            keyboardType="default"
            ref={TextInputRef}
            onContentSizeChange={(e) => handleContentSizeChange(e)}
          />
        </View>

        {isTyping && (
          <Animated.View style={[styles.sendButtonWrapper, sendButtonStyle]}>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={async () => {
                const chatIndex = chats.findIndex(
                  (chats) => chats.id === currentChatId
                );
                if (chatIndex === -1) {
                  let newId = uuid.v4();
                  setCurrentChatId(newId);
                  // await dispatch(
                  //   createNewChat({
                  //     storedMessage: [],
                  //     chatid: newId,
                  //     summary: "New Chat !!",
                  //   })
                  // );

                  await dispatch(
                    createNewChat({
                      storedMessage: [],
                      chatid: newId,
                      summary: "New Chat",
                    })
                  );

                  console.log("In send button");
                  addMessages(newId);
                  // dispatch(saveMessages([], newId));
                  return;
                }
                addMessages(currChatId);
                return;
              }}
            >
              <Ionicons name="send" size={20} color="#000" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default SendButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    minHeight: height * 0.06,
    maxHeight: height * 0.4,
    width: "98%",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: "1%",
    left: 0,
    right: 0,
  },

  subContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
  },

  inputContainer: {
    maxHeight: height * 0.2,
    backgroundColor: "#232626",
    margin: "1%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: "1%",
    borderRadius: 20,
  },

  inputBox: {
    width: "98%",
    padding: 12,
    marginHorizontal: "2%",
    fontSize: RFValue(13),
    color: "#fff",
  },

  sendButtonWrapper: {
    position: "absolute",
    right: 0,
    bottom: RFValue(6),
    justifyContent: "center",
    alignItems: "center",
    width: "13%",
  },

  sendButton: {
    backgroundColor: "#22c063",
    borderRadius: 100,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
