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
import { addMessage, createNewChat } from "../redux/reducers/chatReducer";

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

  const animationValue = useRef(new Animated.Value(0)).current;
  const chats = useSelector((state) => state.chat.chats);

  const handleTextChange = (text) => {
    setisTyping(!!text);
    setMessage(text);
  };

  const handleContentSizeChange = (e) => {
    setHeightOfMessageBox(e.nativeEvent.contentSize.height);
  };

  const addMessages = async (Id) => {
    let selectedId = Id ? Id : currChatId;
    console.log(selectedId);
    await dispatch(
      addMessage({
        chatid: selectedId,
        message: {
          content: "Hi I Am Assistant",
          // content: message,
          time: new Date().toString(),
          role: "assistant",
          // role: "user",
          id: uuid.v4(),
          isMessageRead: false,
          isLoading:true,
        },
      })
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
                  await dispatch(
                    createNewChat({
                      storedMessage: [],
                      chatid: newId,
                      summary: "New Chat !!",
                    })
                  );
                  addMessages(newId);
                  setMessage("");
                  return;
                }

                addMessages();
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
