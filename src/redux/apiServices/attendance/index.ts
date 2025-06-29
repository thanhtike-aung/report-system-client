import { Attendance, AttendancePayload } from "@/types/attendance";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
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
  tagTypes: ["Attendance"],
  endpoints: (builder) => ({
    getAttendances: builder.query<Attendance[], void>({
      query: () => "attendances",
    }),
    getAttendanceById: builder.query<Attendance, string>({
      query: (id) => `attendances/${id}`,
    }),
    getAttendanceByIdAndDate: builder.query<
      Attendance,
      { id: string; date: string }
    >({
      query: (payload) => `attendances/${payload.id}/${payload.date}`,
      providesTags: ["Attendance"],
    }),
    createAttendance: builder.mutation<any, AttendancePayload>({
      query: (body) => ({
        url: "attendances",
        method: "POST",
        body,
      }),
    }),
    updateAttendance: builder.mutation<any, any>({
      query: ({ id, body }) => ({
        url: `attendances/${id}`,
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useGetAttendancesQuery,
  useGetAttendanceByIdQuery,
  useGetAttendanceByIdAndDateQuery,
  useCreateAttendanceMutation,
  useUpdateAttendanceMutation,
} = attendanceApi;
