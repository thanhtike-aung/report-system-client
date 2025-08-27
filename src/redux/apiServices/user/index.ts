import { User, UserPayload } from "@/types/user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  transformApiResponse,
  transformApiResponseSingle,
} from "@/types";

export const userApi = createApi({
  reducerPath: "userApi",
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
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "users",
      transformResponse: transformApiResponse,
      providesTags: ["User"],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
      transformResponse: transformApiResponseSingle,
    }),
    createUser: builder.mutation<any, any>({
      query: (body) => ({
        url: "users",
        method: "POST",
        body,
      }),
    }),
    updateUser: builder.mutation<User, { id: string; body: UserPayload }>({
      query: ({ id, body }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: transformApiResponseSingle,
    }),
    deactivateUser: builder.mutation<User, string>({
      query: (id) => ({
        url: `users/${id}/deactivate`,
        method: "PATCH",
      }),
      transformResponse: transformApiResponseSingle,
    }),
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
    }),
    getUsersExceptId: builder.query<User[], number>({
      query: (id) => `users/not/${id}`,
      transformResponse: transformApiResponse,
    }),
    getAuthorizedReportersWithUsersAndReports: builder.query<User[], void>({
      query: () => "users/authorized/reporters",
      transformResponse: transformApiResponse,
      providesTags: ["User"],
    }),
    getAuthorizedReportersWithOneWeekReports: builder.query<User[], void>({
      query: () => "users/authorized/reporters/week",
      transformResponse: transformApiResponse,
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeactivateUserMutation,
  useDeleteUserMutation,
  useGetUsersExceptIdQuery,
  useGetAuthorizedReportersWithUsersAndReportsQuery,
  useGetAuthorizedReportersWithOneWeekReportsQuery,
} = userApi;
