import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  transformApiResponse,
  transformApiResponseSingle,
} from "@/types";

export const adaptiveCardMessageApi = createApi({
  reducerPath: "adaptiveCardMessageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_VERCEL_API_URL,
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
      transformResponse: transformApiResponse,
    }),
    getCardMessageByType: builder.query<any, string>({
      query: (type) => `cardmessages/${type}`,
      transformResponse: transformApiResponseSingle,
    }),
  }),
});

export const { useGetCardMessagesQuery, useGetCardMessageByTypeQuery } =
  adaptiveCardMessageApi;
