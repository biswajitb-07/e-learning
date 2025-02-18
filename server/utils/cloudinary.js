import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import fs from "fs";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadMedia = async (file) => {
  try {
    if (!file || !file.path || !file.mimetype || !file.size) {
      throw new Error(
        "Invalid file input: Missing file path, mimetype, or size."
      );
    }

    const isImage = file.mimetype.startsWith("image/");
    const isPDF = file.mimetype === "application/pdf";

    let folder, uploadOptions, maxFileSize;

    if (isImage) {
      folder = "e-learning/image";
      maxFileSize = 10 * 1024 * 1024; // 10MB limit
      uploadOptions = {
        resource_type: "image",
        folder: folder,
      };
    } else if (isPDF) {
      folder = "e-learning/pdf";
      maxFileSize = 10 * 1024 * 1024; // 10MB limit
      uploadOptions = {
        resource_type: "raw",
        folder: folder,
        format: "pdf",
        use_filename: true,
        unique_filename: false,
      };
    } else {
      folder = "e-learning/video";
      maxFileSize = 100 * 1024 * 1024; // 100MB limit
      uploadOptions = {
        resource_type: "video",
        folder: folder,
        chunk_size: 6 * 1024 * 1024,
      };
    }


    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(
      file.path,
      uploadOptions
    );

    // Remove file from local storage after successful upload
    fs.unlinkSync(file.path);

    return uploadResponse;
  } catch (error) {
    console.error("Upload Error:", error.message);
    throw error;
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
  }
};

export const deletePdfFromCloudinary = async (publicId) => {
  try {
    if (!publicId) throw new Error("Invalid publicId");

    const cleanPublicId = publicId.split(".")[0];

    const result = await cloudinary.api.delete_resources_by_prefix(
      cleanPublicId,
      {
        resource_type: "raw",
      }
    );

    console.log("Cloudinary delete response:", result);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.log(error);
  }
};
