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
    if (!file || !file.path || !file.mimetype) {
      throw new Error("Invalid file input: filePath or mimetype is missing.");
    }

    const isImage = file.mimetype.startsWith("image/");
    const isPDF = file.mimetype === "application/pdf";

    let folder, uploadOptions;

    if (isImage) {
      folder = "e-learning/image";
      uploadOptions = {
        resource_type: "image",
        folder: folder,
        limits: { fileSize: 10 * 1024 * 1024 },
      };
    } else if (isPDF) {
      folder = "e-learning/pdf";
      uploadOptions = {
        resource_type: "raw",
        folder: "e-learning/pdf",
        format: "pdf",
        use_filename: true,
        unique_filename: false,
        limits: { fileSize: 10 * 1024 * 1024 },
      };
    } else {
      folder = "e-learning/video";
      uploadOptions = {
        resource_type: "video",
        folder: folder,
        chunk_size: 6 * 1024 * 1024,
        limits: { fileSize: 100 * 1024 * 1024 },
      };
    }

    const uploadResponse = await cloudinary.uploader.upload(
      file.path,
      uploadOptions
    );

    // fs.unlinkSync(file.path);

    return uploadResponse;
  } catch (error) {
    console.error("Upload Error:", error);
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
