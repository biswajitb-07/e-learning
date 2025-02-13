import React, { useRef, useState } from "react";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/UI/Loader";
import {
  useSendResetOtpMutation,
  useResetPasswordMutation,
} from "../../features/api/authApi";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef([]);

  // Hooks from authApi
  const [sendResetOtp, { isLoading: resetOtpIsLoading }] =
    useSendResetOtpMutation();
  const [resetPassword, { isLoading: passwordIsLoading }] =
    useResetPasswordMutation();

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const data = await sendResetOtp({ email }).unwrap();
      toast.success(data.message);
      setIsEmailSent(true);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send OTP");
    }
  };

  const onSubmitOTP = (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const data = await resetPassword({ email, otp, newPassword }).unwrap();
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen shadow-2xl bg-white">
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-green-500 text-2xl font-bold text-center mb-4">
            Reset password
          </h1>
          <p className="text-center mb-6 text-black">
            Enter your registered email address
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full">
            <img src={assets.mail_icon} alt="" className="w-4 h-4" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email id"
              className="bg-transparent border rounded-xl px-3 py-1 text-black w-full"
              required
            />
          </div>

          <button
            className={`w-full py-2.5 bg-[#309255] cursor-pointer text-white rounded-full mt-3 ${
              resetOtpIsLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={resetOtpIsLoading}
          >
            {resetOtpIsLoading ? (
              <span className="flex justify-center items-center gap-2">
                <Loader /> <span>Processing...</span>
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      )}

      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOTP}
          className="p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-green-500 text-2xl font-bold text-center mb-4">
            Reset password OTP
          </h1>
          <p className="text-center mb-6 text-black">
            Enter the 6-digit code sent to your email address
          </p>

          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 text-black text-center text-xl rounded-md border "
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>

          <button
            className={`w-full py-2.5 bg-[#309255] cursor-pointer text-white rounded-full ${
              passwordIsLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={passwordIsLoading}
          >
            {passwordIsLoading ? (
              <span className="flex justify-center items-center gap-2">
                <Loader /> <span>Processing...</span>
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      )}

      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-green-500 text-2xl font-bold text-center mb-4">
            New password
          </h1>
          <p className="text-center mb-6 text-black">
            Enter the new password below
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full">
            <img src={assets.lock_icon} alt="" className="w-3 h-3" />
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              placeholder="New Password"
              className="bg-transparent outline-none text-black border py-1 px-3 rounded-xl w-full"
              required
            />
          </div>

          <button
            className={`w-full py-2.5 bg-[#309255] cursor-pointer text-white rounded-full mt-3 ${
              passwordIsLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={passwordIsLoading}
          >
            {passwordIsLoading ? (
              <span className="flex justify-center items-center gap-2">
                <Loader /> <span>Processing...</span>
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
