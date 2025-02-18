import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import userRouter from "./routes/user.route.js";
import courseRouter from "./routes/course.route.js";
import uploadRouter from "./routes/media.route.js";
import purchaseRouter from "./routes/purchaseCourse.route.js";
import progressRouter from "./routes/courseProgress.route.js";
import companyRouter from './routes/company.route.js'
import path from "path";

const app = express();
const port = process.env.PORT || 4000;
const _dirname = path.resolve();

connectDB();

app.use(express.json());

app.use(cookieParser());

const allowedOrigins = [process.env.FRONTEND_URL];

app.use(cors({ origin: allowedOrigins, credentials: true }));

// app.get("/", (req, res) => {
//   res.send("Api Working");
// });

app.use("/api/v1/media", uploadRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/progress", progressRouter);
app.use("/api/v1/company", companyRouter);

app.use(express.static(path.join(_dirname, "/client/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on PORT:${port}`);
});
