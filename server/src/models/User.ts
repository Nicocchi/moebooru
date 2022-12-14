import { Schema, model, connect } from "mongoose";
import { IUser } from "@types";

const schema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: String,
    avatar: String,
    favoritePosts: Array,
    favoriteArtists: Array,
    favoriteTags: Array,
    roles: { type: Schema.Types.Mixed, required: true},
  },
  { timestamps: true }
);

export const User = model<IUser>("User", schema);
