import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Modal from "react-native-modal";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "./CustomText";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useDispatch } from "react-redux";
import {
  createNewChat,
  clearAllChats,
  deleteChat,
} from "../redux/reducers/chatReducer";

import uuid from "react-native-uuid";
const SideDrawer = ({
  isVisible,
  setCurrentChatid,
  currentChatId,
  chats,
  onPressHide,
}) => {
  const dispatch = useDispatch();
  const clearAllChat = async () => {
    await dispatch(clearAllChats());
  };

  const deleteChats = async (chatid) => {
    await dispatch(deleteChat({ chatid: chatid }));
  };

  const createNewChats = async () => {
    await dispatch(
      createNewChat({
        chatid: uuid.v4(),
        storedMessage: [],
        summary: "New Chat!!",
      })
    );
    // onPressHide();
  };

  const renderChats = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setCurrentChatid(item.id);
          onPressHide();
        }}
        style={[
          styles.chatButton,
          {
            backgroundColor: currentChatId == item.id ? "#041e49" : "#131314",
          },
        ]}
      >
        <CustomText numberOfLines={1} style={{ width: "70%" }} fontWeight="700">
          {item.summary}
        </CustomText>

        <TouchableOpacity
          onPress={() => deleteChats(item.id)}
          style={styles.trashIconButton}
        >
          <FontAwesome6 name="trash" size={RFValue(14)} color="#ef4444" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      backdropColor="black"
      onBackdropPress={onPressHide}
      onBackButtonPress={onPressHide}
      style={styles.container}
      isVisible={isVisible}
      backdropOpacity={0.5}
      animationIn={"slideInLeft"}
      animationOut={"slideOutLeft"}
    >
      <SafeAreaView>
        <View style={styles.subContainer}>
          <View style={{ height: "100%", width: "100%" }}>
            <View style={styles.header}>
              <View style={styles.flexRow}>
                <Image
                  source={require("../assets/logo_t.png")}
                  style={{ width: RFValue(30), height: RFValue(30) }}
                />
                <CustomText size={RFValue(16)} opacity={0.8} fontWeight="600">
                  All Chats
                </CustomText>
              </View>
              <TouchableOpacity onPress={onPressHide}>
                <EvilIcons name="close-o" size={RFValue(24)} color="#ccc" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={createNewChats} style={styles.newChat}>
              <CustomText size={RFValue(14)}>+ Add New Chat</CustomText>
            </TouchableOpacity>

            <CustomText style={{ margin: 10, fontSize: RFValue(16) }}>
              Recent
            </CustomText>

            <View>
              <FlatList
                data={[...chats].reverse()}
                renderItem={renderChats}
                key={(id) => id.id}
                keyExtractor={(chat) => chat.id}
                contentContainerStyle={{
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                }}
              />
            </View>
            <TouchableOpacity style={styles.clearChat} onPress={clearAllChat}>
              <CustomText fontWeight="500" fontSize={RFValue(14)}>
                Clear All Chats
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default SideDrawer;

const styles = StyleSheet.create({
  container: {
    width: "70%",
    margin: 3,
    // left:0,
    justifyContent: "flex-end",
  },
  subContainer: {
    // padding:10,
    borderRadius: 20,
    backgroundColor: "#171717",
    overflow: "hidden",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    padding: 10,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "grey",
  },

  flexRow: {
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 15,
  },

  newChat: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#272a2c",
    margin: 10,
    width: "70%",
    alignSelf: "center",
    borderRadius: 100,
  },

  clearChat: {
    backgroundColor: "#ef4444",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    margin: 20,
  },

  chatButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },

  trashIconButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 100,
  },
});
