import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = "https://e-learning-sryx.onrender.com/api/v1/user/";

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Refetch_Request"],
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
      }),
    }),
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(arg, { _, dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (error) {
          console.log(error);
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateUser: builder.mutation({
      query: (FormData) => ({
        url: "profile/update",
        method: "PUT",
        body: FormData,
        credentials: "include",
      }),
    }),
    sendResetOtp: builder.mutation({
      query: (email) => ({
        url: "send-reset-otp",
        method: "POST",
        body: email,
      }),
    }),
    resetPassword: builder.mutation({
      query: (passwordData) => ({
        url: "reset-password",
        method: "POST",
        body: passwordData,
      }),
    }),
    getRequest: builder.query({
      query: () => ({
        url: "get-request",
        method: "GET",
      }),
      providesTags: ["Refetch_Request"],
    }),
    adminRequest: builder.mutation({
      query: (formData) => ({
        url: "admin-request",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Request"],
    }),
    deleteAdminRequest: builder.mutation({
      query: () => ({
        url: "admin-request",
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Request"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
  useSendResetOtpMutation,
  useResetPasswordMutation,
  useGetRequestQuery,
  useAdminRequestMutation,
  useDeleteAdminRequestMutation,
} = authApi;
