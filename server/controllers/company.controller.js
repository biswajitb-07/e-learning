import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { AdminRequest } from "../models/userAdminRequest.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";
import { Lecture } from "../models/lecture.model.js";
import {
  deleteMediaFromCloudinary,
  deletePdfFromCloudinary,
  deleteVideoFromCloudinary,
} from "../utils/cloudinary.js";

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
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const deleteRequest = await AdminRequest.findOne({ userId });

    if (deleteRequest?.publicId) {
      await deletePdfFromCloudinary(deleteRequest.publicId);
    }

    if (deleteRequest) {
      await AdminRequest.deleteOne({ userId });
    }

    await CourseProgress.deleteMany({ userId });
    await CoursePurchase.deleteMany({ userId });

    await Course.updateMany(
      { enrolledStudents: userId },
      { $pull: { enrolledStudents: userId } }
    );

    if (user.photoUrl) {
      const urlParts = user.photoUrl.split("/");
      const filename = urlParts.pop();
      const publicId = filename.split(".")[0];
      await deleteMediaFromCloudinary(`e-learning/image/${publicId}`);
    }

    await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllInstructor = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" }, "-password");
    res.status(200).json({ success: true, instructors });
  } catch (error) {
    console.error("Error fetching instructors:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInstructor = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Instructor not found" });
    }

    const courses = await Course.find({ creator: userId });
    const courseIds = courses.map((course) => course._id);
    const lectureIds = courses.flatMap((course) => course.lectures);
    const lectures = await Lecture.find({ _id: { $in: lectureIds } });

    for (const lecture of lectures) {
      if (lecture.publicId) {
        await deleteVideoFromCloudinary(lecture.publicId);
      }
    }

    await Lecture.deleteMany({ _id: { $in: lectureIds } });
    await CourseProgress.deleteMany({ courseId: { $in: courseIds } });
    await CoursePurchase.deleteMany({ courseId: { $in: courseIds } });

    await User.updateMany(
      { _id: { $in: courses.flatMap((course) => course.enrolledStudents) } },
      { $pull: { enrolledCourses: { $in: courseIds } } }
    );

    for (const course of courses) {
      if (course.courseThumbnail) {
        const urlParts = course.courseThumbnail.split("/");
        const filename = urlParts.pop();
        const publicId = filename.split(".")[0];
        await deleteMediaFromCloudinary(`e-learning/image/${publicId}`);
      }
    }

    await Course.deleteMany({ _id: { $in: courseIds } });
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Instructor and related data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting instructor:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getInstructorCourses = async (req, res) => {
  try {
    const { instructorId } = req.params;

    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== "instructor") {
      return res.status(400).json({ success: false, message: "Access denied" });
    }

    const instructorCourses = await Course.find({ creator: instructorId });

    res.status(200).json({ success: true, instructorCourses });
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAdminRequest = async (req, res) => {
  try {
    const request = await AdminRequest.find({}).populate("userId");
    res.status(200).json({ success: true, request });
  } catch (error) {
    console.error("Error fetching admin requests:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminRequest = async (req, res) => {
  try {
    const { userId, status, userRole } = req.body;

    if (!userId || !status) {
      return res
        .status(400)
        .json({ success: false, message: "User ID and status are required" });
    }

    const userRequest = await AdminRequest.findOneAndUpdate(
      { userId },
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
    console.error("Error updating admin request:", error);
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

    const deleteRequest = await AdminRequest.findById(id);
    if (!deleteRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (deleteRequest.publicId) {
      await deletePdfFromCloudinary(deleteRequest.publicId);
    }

    await AdminRequest.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "Admin request deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin request:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
