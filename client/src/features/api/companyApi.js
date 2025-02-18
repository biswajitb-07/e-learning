import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COMPANY_API = "https://e-learning-sryx.onrender.com/api/v1/company";

export const companyApi = createApi({
  reducerPath: "companyApi",
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
    }),
    getAllInstructor: builder.query({
      query: () => ({
        url: "/instructors",
        method: "GET",
      }),
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
  useGetAllInstructorQuery,
  useGetInstructorCoursesQuery,
  useGetAllAdminRequestQuery,
  useUpdateAdminRequestMutation,
  useDeleteAdminRequestMutation,
} = companyApi;
