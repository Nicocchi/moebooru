import { Schema, model, connect } from "mongoose";
import { IUser } from "@types";

const schema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true},
    avatar: String,
    favoritePosts: Object,
    favoriteArtists: Object,
    favoriteTags: Object,
  },
  { timestamps: true }
);

export const User = model<IUser>("User", schema);