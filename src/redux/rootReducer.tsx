import { combineReducers } from "@reduxjs/toolkit";
import chatReducer from "./reducers/chatReducer";

const rootReducer = combineReducers({
  chat: chatReducer,
});

export default rootReducer;
