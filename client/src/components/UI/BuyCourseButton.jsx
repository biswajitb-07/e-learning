import React from "react";
import { toast } from "react-toastify";
import {
  useCreateCheckoutSessionMutation,
  useConfirmPaymentMutation,
} from "../../features/api/purchaseApi";
import Loader from "../UI/Loader";

// Function to dynamically load the Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession, { isLoading }] =
    useCreateCheckoutSessionMutation();
  const [confirmPayment] = useConfirmPaymentMutation();

  const handlePayment = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error(
        "Razorpay SDK failed to load. Check your internet connection."
      );
      return;
    }

    try {
      const response = await createCheckoutSession(courseId).unwrap();

      if (!response.success) {
        toast.error("Failed to create order. Please try again.");
        return;
      }

      const options = {
        key: response.key, // Razorpay publishable key
        amount: response.amount,
        currency: response.currency,
        name: "Tech Star",
        description: response.courseTitle,
        image: response.courseThumbnail,
        order_id: response.orderId,
        handler: async function (paymentResponse) {

          console.log(paymentResponse);
          
          try {
            await confirmPayment({
              orderId: response.orderId,
              paymentId: paymentResponse.razorpay_payment_id,
              courseId,
              amount: response.amount,
            }).unwrap();

            toast.success("Payment successful! Redirecting...");
            window.location.href = response.success_url;
          } catch (error) {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: "Your User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <button
      disabled={isLoading}
      onClick={handlePayment}
      className="w-full bg-red-500 text-white py-2 px-4 rounded hover:opacity-85 disabled:bg-gray-400 flex items-center justify-center gap-2 cursor-pointer"
    >
      {isLoading ? (
        <>
          <Loader />
          Processing...
        </>
      ) : (
        "Purchase Course"
      )}
    </button>
  );
};

export default BuyCourseButton;
