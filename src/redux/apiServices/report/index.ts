import { Report } from "@/types/report";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  transformApiResponse,
  transformApiResponseSingle,
} from "@/types";

export const reportApi = createApi({
  reducerPath: "reportApi",
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
  tagTypes: ["Reports"],
  endpoints: (builder) => ({
    getReports: builder.query<Report[], void>({
      query: () => "reports",
      transformResponse: transformApiResponse,
      providesTags: ["Reports"],
    }),
    getReportById: builder.query<any, any>({
      query: (id) => `reports/${id}`,
      transformResponse: transformApiResponseSingle,
    }),
    getReportsByIdAndWeekAgo: builder.query<Report[], number>({
      query: (id) => `reports/weekago/${id}`,
      transformResponse: transformApiResponse,
    }),
    getTodayReport: builder.query<Report[], { userId: number; status: string }>(
      {
        query: ({ userId, status }) =>
          `reports/today?userId=${userId}&status=${status}`,
        transformResponse: transformApiResponse,
      }
    ),
    createReport: builder.mutation<any, any>({
      query: (body) => ({
        url: "reports",
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponseSingle,
    }),
    updateReport: builder.mutation<any, any>({
      query: ({ id, body }) => ({
        url: `reports/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: transformApiResponseSingle,
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useGetReportsByIdAndWeekAgoQuery,
  useGetTodayReportQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
} = reportApi;
