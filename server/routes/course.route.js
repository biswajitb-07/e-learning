import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
  getCourseLecture,
  getCreatorCourses,
  getLectureById,
  getPublishedCourse,
  removeLecture,
  searchCourse,
  togglePublishCourse,
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";
const courseRouter = express.Router();

courseRouter.route("/").post(isAuthenticated, createCourse);
courseRouter.route("/search").get(isAuthenticated, searchCourse);
courseRouter.route("/published-courses").get(getPublishedCourse);
courseRouter.route("/").get(isAuthenticated, getCreatorCourses);
courseRouter
  .route("/:courseId")
  .put(isAuthenticated, upload.single("courseThumbnail"), editCourse);
courseRouter.route("/:courseId").get(isAuthenticated, getCourseById);

// lecture
courseRouter.route("/:courseId/lecture").post(isAuthenticated, createLecture);
courseRouter.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
courseRouter
  .route("/:courseId/lecture/:lectureId")
  .post(isAuthenticated, editLecture);
courseRouter
  .route("/lecture/:lectureId")
  .delete(isAuthenticated, removeLecture);
courseRouter.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);

courseRouter.route("/:courseId").patch(isAuthenticated, togglePublishCourse);

export default courseRouter;
