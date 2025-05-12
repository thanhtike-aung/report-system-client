import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adaptiveCardMessageApi = createApi({
  reducerPath: "adaptiveCardMessageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("auth-token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCardMessages: builder.query<any, void>({
      query: () => "cardmessages",
    }),
  }),
});

export const { useGetCardMessagesQuery } = adaptiveCardMessageApi;
