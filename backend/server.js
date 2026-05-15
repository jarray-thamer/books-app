import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import bookRouter from "./routes/bookRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

config();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("MongoDB Connected ✅!"))
  .catch((e) => console.log("❌", e));

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser("your_secret_key"));

app.use("/api/books", bookRouter);
app.use("/api/users", userRouter);

app.listen(process.env.PORT, () =>
  console.log("Server Running on PORT: ", process.env.PORT),
);
