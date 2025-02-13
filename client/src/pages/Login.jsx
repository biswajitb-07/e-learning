import React, { useEffect, useState } from "react";
import assets from "../assets/assets";
import Loader from "../components/UI/Loader";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "../features/api/authApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const navigate = useNavigate();

  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [registerUser, { isLoading: registerIsLoading }] =
    useRegisterUserMutation();
  const [loginUser, { isLoading: loginIsLoading }] = useLoginUserMutation();

  const changeInputHandler = (e) => {
    const { name, value } = e.target;

    if (state === "Sign Up") {
      setSignupInput((prev) => ({ ...prev, [name]: value }));
    } else {
      setLoginInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (state === "Sign Up") {
        const registerResponse = await registerUser(signupInput).unwrap();
        toast.success(registerResponse.message || "Signup successful");
        setState("Login"); // Automatically switch to login after signup
      } else {
        const loginResponse = await loginUser(loginInput).unwrap();
        toast.success(loginResponse.message || "Login successful");
        navigate("/"); // Redirect to home after login
      }
    } catch (error) {
      const errorMessage =
        error?.data?.message || "Something went wrong, please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-[#EEFBF3]">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full sm:w-96 text-[#1D2733] text-sm">
        <h2 className="text-3xl font-bold text-[#309255] text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Sign up for a new account"
            : "Log in to your account"}
        </p>

        <form onSubmit={handleSubmit}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full">
              <img src={assets.person_icon} alt="User Icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={signupInput.name}
                onChange={changeInputHandler}
                required
                className="bg-transparent border border-[#309255] h-8 rounded-3xl p-2 placeholder:text-gray-400 w-full text-[#1D2733]"
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full">
            <img src={assets.mail_icon} alt="Mail Icon" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={state === "Sign Up" ? signupInput.email : loginInput.email}
              onChange={changeInputHandler}
              required
              className="bg-transparent border border-[#005c23f3] h-8 rounded-3xl p-2 placeholder:text-gray-400 w-full text-[#1D2733]"
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full ">
            <img src={assets.lock_icon} alt="Lock Icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={
                state === "Sign Up" ? signupInput.password : loginInput.password
              }
              onChange={changeInputHandler}
              required
              className="bg-transparent border border-[#309255] h-8 rounded-3xl p-2 placeholder:text-gray-400 w-full text-[#1D2733]"
            />
          </div>

          {state === "Login" && (
            <p onClick={() => navigate("/reset-password")} className="mb-4 text-indigo-500 cursor-pointer">
              Forgot password?
            </p>
          )}

          <button
            type="submit"
            disabled={registerIsLoading || loginIsLoading}
            className={`w-full py-2.5 rounded-full text-white font-medium bg-[#309255] hover:opacity-90 cursor-pointer ${
              registerIsLoading || loginIsLoading
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {registerIsLoading || loginIsLoading ? <Loader /> : state}
          </button>
        </form>

        <p className="text-gray-400 text-xs text-center mt-4">
          {state === "Sign Up"
            ? "Already have an account?"
            : "Don't have an account?"}
          <span
            onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
            className="p-1 text-blue-400 cursor-pointer underline"
          >
            {state === "Sign Up" ? "Login here" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
