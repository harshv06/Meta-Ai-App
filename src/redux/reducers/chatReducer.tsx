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
      console.log("Add Message: ", message, chatid);
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
      state.currentChatId = action.payload.latestChatId || "";
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

      // state.chats = action.payload.chats;
    },

    deleteChat: (state, action) => {
      state.chats = state.chats.filter(
        (chat) => chat.id !== action.payload.chatid
      );
      // state.chats=action.payload.chats
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
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatid);
      if (chatIndex !== -1) {
        state.chats[chatIndex].summary = summary;
        if (message) {
          console.log("Reducer",message);
          state.chats[chatIndex].message = message;
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
      const { chatid, messageid, message } = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatid);
      if (chatIndex !== -1) {
        const messageIndex = state.chats[chatIndex].message.findIndex(
          (message) => message.id === messageid
        );
        if (messageIndex !== -1) {
          state.chats[chatIndex].message[messageIndex] = {
            ...message,
            isLoading: false,
            isMessageRead: true,
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
  updateAssistantMessage,
} = chatSlice.actions;

export const selectChats = () => async (dispatch) => {
  const storedMessage = await loadFromSecureStore("chatMessages");
  const chatId = await loadFromSecureStore("latestChatId");
  if (storedMessage && chatId) {
    // If messages and chatId are found, load them into the Redux store
    // console.log("From Reducer: ", JSON.parse(storedMessage), chatId);
    dispatch(loadChats({ chats: JSON.parse(storedMessage), chatId }));
  } else {
    // If no data, initialize with empty chats and chatId
    dispatch(loadChats({ chats: [], chatId: "" }));
  }
};

export const saveMessages =
  ({ message, chatId }) =>
  async (dispatch, getState) => {
    const state = getState();
    let chats = [...state.chat.chats];
    const chatIndex = chats.findIndex((chat) => chat.id === chatId);
    // console.log("Save Message1: ", chatId, message);
    if (chatIndex !== -1) {
      chats[chatIndex] = {
        ...chats[chatIndex],
        message: [...chats[chatIndex].message, message],
      };
      // console.log("Save Message2: ", chats);
      await saveToSecureStore("chatMessages", JSON.stringify(chats));

      dispatch(addMessage({ message: message, chatid: chatId }));
    }
    // console.log("Save Message3: ", chats);
  };

export const clearStorage = () => async (dispatch) => {
  await removeFromSecureStore("chatMessages");
  await removeFromSecureStore("chatid");
  dispatch(clearAllChats());
};

export const saveNewChat =
  ({ storedMessage, chatid, summary }) =>
  async (dispatch, getState) => {
    const state = getState();
    let chats = [...state.chat.chats];
    chats.push({
      id: chatid,
      message: storedMessage ? storedMessage : [],
      summary: summary,
    });
    console.log("Inside saveNewChat:", chats);
    await saveToSecureStore("chatMessages", JSON.stringify(chats));
    await saveToSecureStore("latestChatId", chatid);
    // await saveToSecureStore("chatid", chatid);
    dispatch(createNewChat({ storedMessage, chatid, summary }));
  };

export const saveUpdatedChatSummary =
  ({ chatid, summary, message }) =>
  async (dispatch, getState) => {
    const state = getState();
    // console.log("save Updated Summary: ", summary, chatid);
    let chats = [...state.chat.chats];
    const chatIndex = chats.findIndex((chat) => chat.id === chatid);
    if (chatIndex !== -1) {
      // console.log("Here 3 ", chats[chatIndex].summary, summary);
      chats[chatIndex] = {
        ...chats[chatIndex],
        summary: summary,
      };
      try {
        // Save updated chats to secure store
        await saveToSecureStore("chatMessages", JSON.stringify(chats));
        // console.log("Chats saved successfully!");

        // Dispatch updated summary
        dispatch(updateChatSummary({ summary, chatid, message }));
      } catch (error) {
        console.error("Failed to save updated chats: ", error);
      }
    }
    // console.log("Here 3 ", chats);
  };

export const changeMessageStatus =
  ({ chatid, messageid }) =>
  async (dispatch, getState) => {
    const state = getState();
    let chats = [...state.chat.chats];
    const chatIndex = chats.findIndex((chat) => chat.id === chatid);
    if (chatIndex !== -1) {
      const messageIndex = chats[chatIndex].message.findIndex(
        (message) => message.id === messageid
      );
      if (messageIndex !== -1) {
        const updatedMessage = {
          ...chats[chatIndex].message[messageIndex],
          isLoading: false,
          isMessageRead: true,
        };

        const updatedMessages = [...chats[chatIndex].message];
        updatedMessages[messageIndex] = updatedMessage;
        updatedMessage[messageIndex] = updatedMessage;

        const updatedChat = {
          ...chats[chatIndex],
          message: updatedMessages,
        };

        const updatedChats = [...chats];
        updatedChats[chatIndex] = updatedChat;
        await saveToSecureStore("chatMessages", JSON.stringify(updatedChats));
        dispatch(markMessageAsRead({ chatid, messageid }));
      }
    }
  };

export const AssistantMessage =
  ({ chatid, message, messageid }) =>
  async (dispatch, getState) => {
    const state = getState();
    let chats = [...state.chat.chats];
    const chatIndex = chats.findIndex((chat) => chat.id === chatid);
    if (chatIndex !== -1) {
      const messageIndex = chats[chatIndex].message.findIndex(
        (message) => message.id === messageid
      );
      if (messageIndex !== -1) {
        const updatedMessage = {
          message,
          isLoading: false,
          isMessageRead: true,
        };

        const updatedMessages = [...chats[chatIndex].message];
        updatedMessages[messageIndex] = updatedMessage;

        const updatedChat = {
          ...chats[chatIndex],
          message: updatedMessages,
        };

        const updatedChats = [...chats];
        updatedChats[chatIndex] = updatedChat;
        await saveToSecureStore("chatMessages", JSON.stringify(updatedChats));
        dispatch(updateAssistantMessage({ chatid, message, messageid }));
      }
    }
  };

export const clearCurrentChatfromStorage =
  ({ chatid }) =>
  async (dispatch, getState) => {
    const state = getState();
    let chats = [...state.chat.chats];
    const chatIndex = chats.findIndex((chat) => chat.id === chatid);
    if (chatIndex !== -1) {
      chats[chatIndex].message = [];
      await saveToSecureStore("chatMessages", JSON.stringify(chats));
      dispatch(clearCurrentChat({ chats }));
    }
  };

  export const deleteChatFromStorage =
  ({ chatid   }) =>
  async (dispatch, getState) => {
    const state = getState();
    let chats = [...state.chat.chats];
    const chatIndex = chats.findIndex((chat) => chat.id === chatid);
    if (chatIndex !== -1) {
      chats.splice(chatIndex, 1);
      await saveToSecureStore("chatMessages", JSON.stringify(chats));
      dispatch(deleteChat({ chats }));
    }
  };

export default chatSlice.reducer;
