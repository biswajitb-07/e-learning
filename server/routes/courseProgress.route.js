import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getCourseProgress,
  markAsCompleted,
  markAsInCompleted,
  updateLectureProgress,
} from "../controllers/courseProgress.controller.js";

const progressRouter = express.Router();

progressRouter.route("/:courseId").get(isAuthenticated, getCourseProgress);
progressRouter
  .route("/:courseId/lecture/:lectureId/view")
  .post(isAuthenticated, updateLectureProgress);
progressRouter
  .route("/:courseId/complete")
  .post(isAuthenticated, markAsCompleted);
progressRouter
  .route("/:courseId/incomplete")
  .post(isAuthenticated, markAsInCompleted);

export default progressRouter;
