import mongoose from "mongoose";
import { Blog } from "./blog.models.js";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    numBlogs: {
      type: Number,
      default: 0,
    },
    blog: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
