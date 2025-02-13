import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

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
    const folder = isImage ? "e-learning/image" : "e-learning/video";

    const uploadOptions = isImage
      ? {
          resource_type: "image",
          folder: folder,
          limits: { fileSize: 10 * 1024 * 1024 },
        }
      : {
          resource_type: "video",
          folder: folder,
          chunk_size: 6 * 1024 * 1024,
          limits: { fileSize: 100 * 1024 * 1024 },
        };

    const uploadResponse = await cloudinary.uploader.upload(
      file.path,
      uploadOptions
    );

    return uploadResponse;
  } catch (error) {
    console.error("Upload Error:", error);
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.log(error);
  }
};
