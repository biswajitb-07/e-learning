import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";

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
