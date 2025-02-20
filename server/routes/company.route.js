import express from "express";
import {
  deleteAdminRequest,
  deleteUser,
  getAllAdminRequest,
  getAllInstructor,
  getAllUsers,
  getInstructorCourses,
  updateAdminRequest,
} from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const companyRouter = express.Router();

companyRouter.route("/users").get(isAuthenticated, getAllUsers);
companyRouter.route("/delete-user").delete(isAuthenticated, deleteUser);
companyRouter.route("/instructors").get(isAuthenticated, getAllInstructor);
companyRouter
  .route("/instructor/:instructorId/courses")
  .get(getInstructorCourses);
companyRouter.route("/request").get(isAuthenticated, getAllAdminRequest);
companyRouter.route("/update-request").put(isAuthenticated, updateAdminRequest);
companyRouter
  .route("/delete-request")
  .delete(isAuthenticated, deleteAdminRequest);

export default companyRouter;
