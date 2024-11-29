import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import useKeyboardHeightOffset from "../helpers/useKeyboardHeightOffset";
import getMessageBoxHeight from "../helpers/getMessageBoxHeight";
import { FlashList } from "@shopify/flash-list";
import MessageBubble from "./MessageBubble";

const windowHeight = Dimensions.get("window").height;
const Chat = ({ isTyping, message, heightOfMessageBox }) => {
  const keyboardHeight = useKeyboardHeightOffset();
  console.log(message);
  const renderMessageBubble = ({ item }) => <MessageBubble message={item} />;
  return (
    <View
      style={{
        height:
          windowHeight * 0.76 -
          keyboardHeight * 0.95 -
          getMessageBoxHeight(heightOfMessageBox, windowHeight),
      }}
    >
      {message?.length == 0 ? (
        <Text>Empty</Text>
      ) : (
        <FlashList
          indicatorStyle="black"
          data={[...message].reverse()}
          inverted
          estimatedItemSize={40}
          renderItem={renderMessageBubble}
        />
      )}
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({});
