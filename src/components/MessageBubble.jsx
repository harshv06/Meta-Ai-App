import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import dayjs from "dayjs";
import TickIcon from "../assets/tick.png";
import MarkdownDisplay from "react-native-markdown-display";
import LoadingDots from "./LoadingDots";

const MessageBubble = ({ message }) => {
  console.log("Bubble", message);
  const role = message.role == "user";
  const isMessageRead = message?.isMessageRead;
  return (
    <View
      style={{
        ...styles.messageContainer,
        maxWidth: role ? "80%" : "92%",
        alignSelf: role ? "flex-end" : "flex-start",
        backgroundColor: role ? "#154d37" : "#232626",
        borderTopLeftRadius: role ? 5 : 0,
        borderTopRightRadius: role ? 0 : 5,
      }}
    >
      {!role && (
        <View
          style={{
            ...styles.leftMessageArrow,
            display: role ? "none" : "flex",
          }}
        ></View>
      )}

      {message?.isLoading ? (
        <LoadingDots />
      ) : message?.imageUri ? (
        <Image
          source={{ uri: message?.imageUri }}
          // source={message?.imageUri}
          style={{
            height: RFPercentage(20),
            width: RFPercentage(35),
            resizeMode: "cover",
            aspectRatio: 4 / 4,
            borderRadius: 20,
            left: 7,
          }}
        />
      ) : null}

      {message.content && (
        <MarkdownDisplay
          style={{
            body: {
              ...styles.messageText,
              left: role ? 10 : 0,
              marginVertical: 0,
              paddingVertical: 0,
            },
            link: {
              color: "lightblue",
            },
            blockquote: {
              color: "white",
              backgroundColor: "#1d211e",
              borderRadius: 4,
              borderLeftWidth: 0,
            },
            table: {
              borderColor: "white",
            },
            code_inline: {
              backgroundColor: "#1d211e",
              color: "white",
              borderRadius: 5,
              fence: {
                backgroundColor: "#1d211e",
                color: "white",
                borderRadius: 5,
                borderWidth: 0,
              },
              tr: {
                borderColor: "white",
              },
            },
          }}
        >
          {message.content}
        </MarkdownDisplay>
      )}

      {role && (
        <View
          style={{
            ...styles.RightMessageArrow,
            display: role ? "flex" : "none",
          }}
        ></View>
      )}

      <View style={{ ...styles.timeAndReadContainer, right: 0 }}>
        <Text style={styles.timeText}>
          {dayjs(message.time).format("HH:mm A")}
        </Text>
        {role && (
          <View>
            <Image
              source={TickIcon}
              tintColor={isMessageRead ? "#53a6fd" : "#8aa69b"}
              style={{ width: 15, height: 15 }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({
  messageContainer: {
    minWidth: "24%",
    marginVertical: 8,
    marginHorizontal: 10,
    flexDirection: "row",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    elevation: 10,
    borderRadius: 10,
  },

  messageText: {
    color: "#fff",
    fontSize: RFValue(11.4),
    marginBottom: 10,
    marginRight: 10,
    maxWidth: "70%",
    minWidth: "30%",
    paddingRight: 10,
  },

  leftMessageArrow: {
    height: 0,
    width: 0,
    borderLeftWidth: 10,
    borderLeftColor: "transparent",
    borderTopColor: "#232626",
    borderTopWidth: 10,
    alignSelf: "flex-start",
    borderRightColor: "black",
    right: 10,
    bottom: 0,
  },

  RightMessageArrow: {
    height: 0,
    position: "absolute",
    width: 0,
    borderRightColor: "transparent",
    borderTopColor: "#154d37",
    borderTopWidth: 10,
    alignSelf: "flex-end",
    borderRightWidth: 10,
    right: -8,
    top: 0,
  },

  timeAndReadContainer: {
    flexDirection: "row",
    alignItems: "center",
    bottom: 2,
    position: "absolute",
    paddingHorizontal: 10,
    gap: 2,
  },

  timeText: {
    fontSize: RFValue(8),
    fontWeight: "400",
    color: "#8aa69b",
  },
});
