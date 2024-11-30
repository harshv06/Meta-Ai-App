import { createSlice } from "@reduxjs/toolkit";
import {
  loadFromSecureStore,
  removeFromSecureStore,
  saveToSecureStore,
} from "../storage";
import { act } from "react";

const initialState = {
  chats: [],
  currentChatId: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createNewChat: (state, action) => {
      const { storedMessage, chatid, summary } = action.payload;
      state.chats.push({
        id: chatid,
        summary: summary,
        message: storedMessage ? storedMessage : [],
      });
    },

    addMessage: (state, action) => {
      const { message, chatid } = action.payload;
      const chat = state.chats.findIndex((chat) => chat.id === chatid);
      if (chat !== -1) {
        state.chats[chat].message.push(message);
      }
    },

    clearAllChats: (state) => {
      state.chats = [];
      state.currentChatId = "";
    },

    loadChats: (state, action) => {
      // console.log("Load Chats: ", action.payload.chats);
      state.chats = action.payload.chats || {};
      state.currentChatId = action.payload.chatId || "";
    },

    changeCurrentChatId: (state, action) => {
      state.currentChatId = action.payload.chatid;
    },

    clearCurrentChat: (state, action) => {
      const chatIndex = state.chats.findIndex(
        (chat) => chat.id === action.payload.chatid
      );
      if (chatIndex !== -1) {
        state.chats[chatIndex].message = [];
      }
    },

    deleteChat: (state, action) => {
      state.chats = state.chats.filter(
        (chat) => chat.id !== action.payload.chatid
      );
    },
    markMessageAsRead: (state, action) => {
      const { chatId, messageId } = action.payload;
      const chat = state.chats.find((chat) => chat.id === chatId);
      if (chat) {
        const message = chat.message.find(
          (message) => message.id === messageId
        );
        if (message) {
          message.isMessageRead = true;
        }
      }
    },

    updateChatSummary: (state, action) => {
      const { summary, message, chatid } = action.payload;
      const chatIndex = state.chats.findIndex(
        (chat) => chat.id === action.payload.chatid
      );
      if (chatIndex !== -1) {
        state.chats[chatIndex].summary = summary;
        // console.log(summary);
        if (message) {
          state.chats[chatIndex].messages = message;
        }
      }
    },

    addAssistantMessage: (state, action) => {
      const { message, chatid } = action.payload;
      const chatIndex = state.chats.findIndex(
        (chat) => chat.id === action.payload.chatid
      );
      if (chatIndex !== -1) {
        state.chats[chatIndex].message.push({
          ...message,
          isLoading: true,
        });
      }
    },

    updateAssistantMessage: (state, action) => {
      const { chatid, messageid,message } = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatid);
      if (chatIndex !== -1) {
        const messageIndex = state.chats[chatIndex].message.findIndex(
          (message) => message.id === messageid
        );
        if (messageIndex !== -1) {
          state.chats[chatIndex].message[messageIndex]={
            ...message,
            isLoading: false,
            isMessageRead: true
          };
        }
      }
    },
  },
});

export const {
  clearAllChats,
  createNewChat,
  loadChats,
  changeCurrentChatId,
  addMessage,
  clearCurrentChat,
  deleteChat,
  updateChatSummary,
  markMessageAsRead,
  addAssistantMessage,
  updateAssistantMessage
} = chatSlice.actions;

export const selectChats = () => async (dispatch) => {
  const storedMessage = await loadFromSecureStore("chatMessages");
  const chatId = await loadFromSecureStore("chatid");
  if (storedMessage && chatId) {
    // If messages and chatId are found, load them into the Redux store
    // console.log("From Reducer: ", storedMessage, chatId);
    dispatch(loadChats({ chats: JSON.parse(storedMessage), chatId }));
  } else {
    // If no data, initialize with empty chats and chatId
    dispatch(loadChats({ chats: [], chatId: "" }));
  }
};

export const saveMessages =
  (messages, chatId) => async (dispatch, getState) => {
    const state = getState();
    let chats = [...state.chat.chats];
    chats.push(messages);
    // console.log("Idhar", chats);
    await saveToSecureStore("chatMessages", JSON.stringify(chats));
    await saveToSecureStore("chatid", chatId);
    dispatch(setMessage({ storedMessage: messages, chatid: chatId }));
  };

export const clearStorage = () => async (dispatch) => {
  await removeFromSecureStore("chatMessages");
  await removeFromSecureStore("chatid");
  dispatch(clearAllChats());
};

export default chatSlice.reducer;
