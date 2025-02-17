import express from "express";
import {
  adminRequest,
  deleteRequest,
  getRequest,
  getUserProfile,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const userRouter = express.Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/logout").get(logout);
userRouter.route("/profile").get(isAuthenticated, getUserProfile);
userRouter
  .route("/profile/update")
  .put(isAuthenticated, upload.single("profilePhoto"), updateProfile);
userRouter.post("/send-reset-otp", sendResetOtp);
userRouter.post("/reset-password", resetPassword);
userRouter.route("/get-request").get(isAuthenticated, getRequest);
userRouter
  .route("/admin-request")
  .post(isAuthenticated, upload.single("resume"), adminRequest);
userRouter.route("/admin-request").delete(isAuthenticated, deleteRequest);

export default userRouter;
