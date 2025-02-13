import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API =
  "https://e-learning-sryx.onrender.com/api/v1/purchase";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  tagTypes: ["Refetch_Course_Details"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: { courseId },
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Refetch_Course_Details"],
    }),
    confirmPayment: builder.mutation({
      query: ({ orderId, paymentId, userId, courseId, amount }) => ({
        url: "/confirm-payment",
        method: "POST",
        body: { orderId, paymentId, userId, courseId, amount },
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Refetch_Course_Details"],
    }),
    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
      providesTags: ["Refetch_Course_Details"],
    }),
    getPurchasedCourses: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useConfirmPaymentMutation,
  useGetCourseDetailWithStatusQuery,
  useGetPurchasedCoursesQuery,
} = purchaseApi;
