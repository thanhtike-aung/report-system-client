import {
  ErrorResponse as ApiErrorResponse,
  ChangePasswordRequest,
  LoginRequest,
} from "@/types/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_VERCEL_API_URL }),
  endpoints: (builder) => ({
    login: builder.mutation<string | ApiErrorResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    changePassword: builder.mutation<any, ChangePasswordRequest>({
      query: (credentials) => ({
        url: "/changePassword",
        method: "PATCH",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
} = authApi;
