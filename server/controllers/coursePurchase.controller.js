import Razorpay from "razorpay";
import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const courseId = new mongoose.Types.ObjectId(req.body.courseId);

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    const amount = course.coursePrice * 100;

    // Create a new order in Razorpay
    const options = {
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        courseId: courseId.toString(),
        userId: userId.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res
        .status(400)
        .json({ success: false, message: "Error creating order" });
    }

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_PUBLISHABLE_KEY,
      courseTitle: course.courseTitle,
      courseThumbnail: course.courseThumbnail,
      success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}`,
      cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentId, courseId } = req.body;
    const userId = req.id;

    const purchaseExists = await CoursePurchase.findOne({ paymentId });
    if (purchaseExists) {
      return res
        .status(400)
        .json({ success: false, message: "Payment already processed" });
    }

    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: req.body.amount / 100,
      status: "completed",
      paymentId,
    });

    await newPurchase.save();

    // Unlock Course Content for User
    await Lecture.updateMany(
      { _id: { $in: courseId.lectures } },
      { $set: { isPreviewFree: true } }
    );

    // Add Course to User's Enrolled List
    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId },
    });

    // Add User to Course's Enrolled Students List
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { enrolledStudents: userId },
    });

    return res.status(200).json({
      success: true,
      message: "Payment confirmed and course unlocked.",
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId).populate("creator lectures");
    if (!course) return res.status(404).json({ message: "Course not found!" });

    const purchased = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed",
    });

    return res.status(200).json({
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPurchasedCourse = async (req, res) => {
  try {
    const userId = req.id;

    const userCreateCourse = await Course.find({
      creator: userId,
    });

    if (userCreateCourse.length === 0) {
      return res.status(404).json({
        userCreateCourse: [],
        message: "Instructor has not create course yet",
      });
    }

    const courseIds = userCreateCourse.map(
      (course) => new mongoose.Types.ObjectId(course._id)
    );

    const salesCourse = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    }).populate("courseId");

    if (!salesCourse || salesCourse.length === 0) {
      return res.status(404).json({
        salesCourse: [],
        message: "No purchased courses found",
      });
    }

    return res.status(200).json({ salesCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
