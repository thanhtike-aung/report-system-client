import { Report } from "@/types/report";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
      providesTags: ["Reports"],
    }),
    getReportById: builder.query<any, any>({
      query: (id) => `reports/${id}`,
    }),
    getReportsByIdAndWeekAgo: builder.query<Report[], number>({
      query: (id) => `reports/weekago/${id}`,
    }),
    getTodayReport: builder.query<Report[], { userId: number; status: string }>(
      {
        query: ({ userId, status }) =>
          `reports/today?userId=${userId}&status=${status}`,
      }
    ),
    createReport: builder.mutation<any, any>({
      query: (body) => ({
        url: "reports",
        method: "POST",
        body,
      }),
    }),
    updateReport: builder.mutation<any, any>({
      query: ({ id, body }) => ({
        url: `reports/${id}`,
        method: "PATCH",
        body,
      }),
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
