import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.jsx";
import userReducer from "./userSlice.jsx";
import userFeed from "./feedSlice.jsx";
import userConnections from "./connectionSlice.jsx";
import userRequest from "./requestSlice.jsx";
import notificationReducer from "./notificationSlice.jsx";

const appStore = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    feed: userFeed,
    connections: userConnections,
    requests: userRequest,
    notifications: notificationReducer,
  },
});

export default appStore;
