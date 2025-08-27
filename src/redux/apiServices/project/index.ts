import { Project } from "@/types/project";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  transformApiResponse,
  transformApiResponseSingle,
} from "@/types";

export const projectApi = createApi({
  reducerPath: "projectApi",
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
  tagTypes: ["Projects"],
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => "projects",
      transformResponse: transformApiResponse,
      keepUnusedDataFor: 60,
      providesTags: ["Projects"],
    }),
    getProjectById: builder.query<Project, string>({
      query: (id) => `project/${id}`,
      transformResponse: transformApiResponseSingle,
    }),
    createProject: builder.mutation<Project, { name: string; color: string }>({
      query: (body) => ({
        url: "projects",
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponseSingle,
    }),
    updateProject: builder.mutation<
      Project,
      { id: number; body: Record<string, string> }
    >({
      query: ({ id, body }) => ({
        url: `projects/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: transformApiResponseSingle,
    }),
    deleteProject: builder.mutation<Project, number>({
      query: (id) => ({
        url: `projects/${id}`,
        method: "DELETE",
      }),
      transformResponse: transformApiResponseSingle,
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
