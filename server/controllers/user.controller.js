import { User } from "../models/user.model.js";
import { AdminRequest } from "../models/userAdminRequest.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import {
  deleteMediaFromCloudinary,
  deletePdfFromCloudinary,
  uploadMedia,
} from "../utils/cloudinary.js";
import transporter from "../utils/nodemailer.js";
import mongoose from "mongoose";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password is at least 6 character" });
    }

    const existdUser = await User.findOne({ email });

    if (existdUser) {
      return res
        .status(400)
        .json({ success: false, message: "email or username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "register succesful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "failed to register" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password" });

    generateToken(res, user, `Welcom back ${user.name}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "enrolledCourses",
        populate: {
          path: "creator",
          select: "name photoUrl",
        },
      });

    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let photoUrl = user.photoUrl; // Keep the existing photo URL by default

    if (profilePhoto) {
      // Extract public ID from the old photo URL (if it exists)
      if (user.photoUrl) {
        const urlParts = user.photoUrl.split("/");
        const filename = urlParts[urlParts.length - 1]; // Get last part of URL
        const publicId = filename.split(".")[0]; // Remove extension
        await deleteMediaFromCloudinary(`e-learning/image/${publicId}`);
      }

      // Upload the new profile photo
      const cloudResponse = await uploadMedia(req.file);
      if (!cloudResponse || !cloudResponse.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile photo.",
        });
      }

      photoUrl = cloudResponse.secure_url; // Update photo URL
    }

    // Update user profile (name and optionally photo URL)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, photoUrl },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password ${otp}. Use this OTP to proceed with resetting your password.`,
    };

    await transporter.sendMail(mailOption);

    return res.json({ success: true, message: "OTP sent your email" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to send otp" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email , OTP , and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password is at least 6 character" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      res.status(400).json({ success: false, message: "OTP Expired" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRequest = async (req, res) => {
  try {
    const userId = req.id;

    const objectId = new mongoose.Types.ObjectId(userId);

    // Query using an object filter
    const userRequest = await AdminRequest.findOne({ userId: objectId });
    if (!userRequest) {
      return res.status(404).json({
        success: false,
        message: "No request found",
      });
    }

    return res
      .status(200)
      .json({ success: true, userRequest: userRequest || [] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to send request, try after sometimes",
    });
  }
};

export const adminRequest = async (req, res) => {
  try {
    const userId = req.id;
    const resume = req.file;

    const userRequest = await AdminRequest.findOne({ userId });
    if (userRequest) {
      return res.status(409).json({
        success: false,
        message: "You have already sent a request.",
      });
    }

    // Validate file existence
    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "Resume is required for admin request.",
      });
    }

    // Validate file type (must be PDF)
    if (resume.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Only PDF resumes are allowed.",
      });
    }

    const cloudResponse = await uploadMedia(resume);

    // Ensure upload was successful
    if (!cloudResponse || !cloudResponse.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload resume, please try again.",
      });
    }

    let fileUrl = cloudResponse.secure_url;

    const publicId = cloudResponse.public_id;

    // Create a new admin request
    const newRequest = new AdminRequest({
      userId,
      fileUrl,
      publicId,
    });

    await newRequest.save();

    return res.status(201).json({
      success: true,
      newRequest,
      message: "Request sent successfully.",
    });
  } catch (error) {
    console.error("Admin Request Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send request, please try again later.",
    });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const userId = req.id;

    const objectId = new mongoose.Types.ObjectId(userId);
    // Find the user's admin request
    const userRequest = await AdminRequest.findOne({ userId: objectId });

    if (!userRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    // Delete uploaded resume from Cloudinary if it exists
    if (userRequest.publicId) {
      await deletePdfFromCloudinary(userRequest.publicId);
    }

    // Remove the request from the database
    await AdminRequest.deleteOne({ userId });

    return res.status(200).json({
      success: true,
      message: "Admin request deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete admin request.",
    });
  }
};
