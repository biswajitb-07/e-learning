import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";

const uploadRouter = express.Router();

uploadRouter
  .route("/upload-video")
  .post(upload.single("file"), async (req, res) => {
    try {
      const result = await uploadMedia(req.file);
      res.status(200).json({
        success: true,
        message: "File uploaded successfully.",
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error uploading file" });
    }
  });
export default uploadRouter;
