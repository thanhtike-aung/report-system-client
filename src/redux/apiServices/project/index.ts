import { Project } from "@/types/project";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectApi = createApi({
  reducerPath: "projectApi",
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
  tagTypes: ["Projects"],
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => "projects",
      keepUnusedDataFor: 60,
      providesTags: ["Projects"],
    }),
    getProjectById: builder.query<Project, string>({
      query: (id) => `project/${id}`,
    }),
    createProject: builder.mutation<Project, { name: string; color: string }>({
      query: (body) => ({
        url: "projects",
        method: "POST",
        body,
      }),
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
    }),
    deleteProject: builder.mutation<Project, number>({
      query: (id) => ({
        url: `projects/${id}`,
        method: "DELETE",
      }),
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
