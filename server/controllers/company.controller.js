import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { AdminRequest } from "../models/userAdminRequest.model.js";
import mongoose from "mongoose";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "student" })
      .select("-password -role:'company")
      .populate({
        path: "enrolledCourses",
        select: "courseTitle",
      });

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllInstructor = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" }, "-password");
    res.status(200).json({ success: true, instructors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.params.instructorId;

    const instructor = await User.findById(instructorId);

    if (instructor.role === "instructor") {
      const instructorCourses = await Course.find({ creator: instructorId });

      res.status(200).json({ success: true, instructorCourses });
    } else {
      res.status(400).json({ success: false, message: "Access denied" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAdminRequest = async (req, res) => {
  try {
    const request = await AdminRequest.find({}).populate("userId");

    res.status(200).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminRequest = async (req, res) => {
  try {
    const { userId, status, userRole } = req.body;

    console.log(userId);

    if (!userId || !status) {
      return res
        .status(400)
        .json({ success: false, message: "User ID and status are required" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    const userRequest = await AdminRequest.findOneAndUpdate(
      { userId: objectId },
      { status },
      { new: true }
    );

    if (!userRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Admin request not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.role = userRole || "student";
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdminRequest = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    const deleteRequest = await AdminRequest.findByIdAndDelete(id);

    if (!deleteRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Admin request deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
