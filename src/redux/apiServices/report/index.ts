import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reportApi = createApi({
  reducerPath: "reportApi",
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
    getReports: builder.query<any, any>({
      query: () => "reports",
    }),
    getReportById: builder.query<any, any>({
      query: (id) => `reports/${id}`,
    }),
    createReport: builder.mutation<any, any>({
      query: (body) => ({
        url: "reports",
        method: "POST",
        body,
      }),
    }),
    updateReport: builder.mutation<any, any>({
      query: ({ id, body }) => ({
        url: `posts/${id}`,
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
} = reportApi;
