import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COMPANY_API = "https://e-learning-sryx.onrender.com/api/v1/company";

export const companyApi = createApi({
  reducerPath: "companyApi",
  tagTypes: ["Refetch_User", "Refetch_Instructor"],
  baseQuery: fetchBaseQuery({
    baseUrl: COMPANY_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["Refetch_User"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: "delete-user",
        method: "DELETE",
        body: { userId },
      }),
      invalidatesTags: ["Refetch_User"],
    }),
    getAllInstructor: builder.query({
      query: () => ({
        url: "/instructors",
        method: "GET",
      }),
      providesTags: ["Refetch_Instructor"],
    }),
    deleteInstructor: builder.mutation({
      query: (userId) => ({
        url: "delete-instructor",
        method: "DELETE",
        body: { userId },
      }),
      invalidatesTags: ["Refetch_Instructor"],
    }),
    getInstructorCourses: builder.query({
      query: (instructorId) => ({
        url: `/instructor/${instructorId}/courses`,
        method: "GET",
      }),
    }),
    getAllAdminRequest: builder.query({
      query: () => ({
        url: "/request",
        method: "GET",
      }),
    }),
    updateAdminRequest: builder.mutation({
      query: ({ userId, status, userRole }) => ({
        url: "/update-request",
        method: "PUT",
        body: { userId, status, userRole },
      }),
      invalidatesTags: ["Refetch_Instructor"],
    }),
    deleteAdminRequest: builder.mutation({
      query: (id) => ({
        url: "/delete-request",
        method: "DELETE",
        body: { id },
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useGetAllInstructorQuery,
  useDeleteInstructorMutation,
  useGetInstructorCoursesQuery,
  useGetAllAdminRequestQuery,
  useUpdateAdminRequestMutation,
  useDeleteAdminRequestMutation,
} = companyApi;
