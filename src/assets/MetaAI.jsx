import { ImageBackground, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "../components/CustomHeader";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentChatId,
  selectChats,
} from "../redux/reducers/chatReducer";
import SendButton from "../components/SendButton";
import Chat from "../components/Chat";

const MetaAI = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);
  const chatId = useSelector((state) => state.chat.currentChatId);
  // useEffect(() => {
  //   dispatch(selectChats());
  // }, [dispatch]);
  // //("Main Console", chats, " ", chatId);
  // //("Key", chats, " ", chatId);
  console.log(chats, " ", chatId);
  const [isTyping, setisTyping] = useState(false);
  const [heightOfMessageBox, setHeightOfMessageBox] = useState(0);

  const setCurrentChatId = (id) => {
    dispatch(changeCurrentChatId({ chatid: id }));
  };

  return (
    <ImageBackground
      source={require("./w_bg.png")}
      style={style.cotainer}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <CustomHeader
        chatid={chatId}
        setCurrentChatid={setCurrentChatId}
        chats={chats}
      />
      <Chat
        isTyping={isTyping}
        message={chats?.find((chat) => chat.id === chatId)?.message || []}
        heightOfMessageBox={heightOfMessageBox}
      />
      <SendButton
        isTyping={isTyping}
        heightOfMessageBox={heightOfMessageBox}
        setHeightOfMessageBox={setHeightOfMessageBox}
        setisTyping={setisTyping}
        currentChatId={chatId}
        setCurrentChatId={(id) => setCurrentChatId(id)}
        length={
          chats?.find((chat) => chat.id === chatId)?.message?.length ||
          [].length
        }
        messages={chats?.find((chat) => chat.id === chatId)?.message || []}
      />
    </ImageBackground>
  );
};

const style = StyleSheet.create({
  cotainer: {
    flex: 1,
  },
});

export default MetaAI;
