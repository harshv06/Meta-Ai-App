import {
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import WABG from "./w_bg.png";
import React, { useEffect, useState } from "react";
import CustomHeader from "../components/CustomHeader";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentChatId,
  clearStorage,
  selectChats,
} from "../redux/reducers/chatReducer";
import { setMessage } from "../redux/reducers/chatReducer";
import { saveMessages } from "../redux/reducers/chatReducer";
import SendButton from "../components/SendButton";
import Chat from "../components/Chat";

const MetaAI = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);
  const chatId = useSelector((state) => state.chat.currentChatId);
  console.log("Main Console", chats, " ", chatId);
  const [isTyping, setisTyping] = useState(false);
  const [heightOfMessageBox, setHeightOfMessageBox] = useState(0);
  const [message, setTextMessage] = useState("");

  const setCurrentChatId = (id) => {
    dispatch(changeCurrentChatId({ chatid: id }));
  };

  // useEffect(() => {
  //   dispatch(selectChats());
  //   console.log("Dispatched");
  // }, [dispatch]);

  return (
    <ImageBackground source={WABG} style={style.cotainer} resizeMode="cover">
      <StatusBar style="light" />
      <CustomHeader />
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
          chats?.find((chat) => chat.id === chatId)?.messages?.length ||
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
