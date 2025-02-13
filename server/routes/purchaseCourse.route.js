import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  confirmPayment,
  createCheckoutSession,
  getAllPurchasedCourse,
  getCourseDetailWithPurchaseStatus,
} from "../controllers/coursePurchase.controller.js";

const purchaseRouter = express.Router();

purchaseRouter
  .route("/checkout/create-checkout-session")
  .post(isAuthenticated, createCheckoutSession);
purchaseRouter.route("/confirm-payment").post(isAuthenticated, confirmPayment);
purchaseRouter
  .route("/course/:courseId/detail-with-status")
  .get(isAuthenticated, getCourseDetailWithPurchaseStatus);

purchaseRouter.route("/").get(isAuthenticated, getAllPurchasedCourse);

export default purchaseRouter;
