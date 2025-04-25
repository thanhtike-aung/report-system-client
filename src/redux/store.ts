import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/auth/";
import userUpdateReducer from "@/redux/slices/user/userSlice";
import { authApi } from "./apiServices/auth";
import { attendanceApi } from "./apiServices/attendance";
import { userApi } from "./apiServices/user";
import { projectApi } from "./apiServices/project";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userUpdate: userUpdateReducer,
    [authApi.reducerPath]: authApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      attendanceApi.middleware,
      userApi.middleware,
      projectApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
