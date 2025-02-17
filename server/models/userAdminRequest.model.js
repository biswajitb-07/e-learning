import mongoose from "mongoose";

const userAdminRequesetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "successful", "rejected"],
      default: "pending",
    },
    fileUrl: { type: String },
    publicId: { type: String },
  },
  { timestamps: true }
);

export const AdminRequest = mongoose.model(
  "admin_request",
  userAdminRequesetSchema
);
