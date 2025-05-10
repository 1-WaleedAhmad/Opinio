import mongoose from "mongoose";
import { Blogger } from "./bloger.models.js";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
export const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

const blogSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    blogger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blogger",
      required: true
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
