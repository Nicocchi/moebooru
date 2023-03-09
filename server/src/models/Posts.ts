import { Schema, model } from "mongoose";
import { IPost } from "@types";

const schema = new Schema<IPost>(
  {
    name: { type: String, required: true},
    artists: [String],
    tags: [String],
    uploader: String,
    width: Number,
    height: Number,
    type: String,
    source: String,
    nsfw: Boolean,
    hidden: Boolean,
    anonymous: Boolean,
  },
  { timestamps: true }
);

export const Post = model<IPost>("Posts", schema);
