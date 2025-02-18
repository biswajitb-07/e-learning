import express from "express";
import {
  getAllInstructor,
  getAllUsers,
  getInstructorCourses,
} from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const companyRouter = express.Router();

companyRouter.route("/users").get(isAuthenticated, getAllUsers);
companyRouter.route("/instructors").get(isAuthenticated, getAllInstructor);
companyRouter
  .route("/instructor/:instructorId/courses")
  .get(getInstructorCourses);

export default companyRouter;
