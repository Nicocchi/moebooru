import { Schema, model } from "mongoose";
import { IArtist } from "@types";

const schema = new Schema<IArtist>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Artist = model<IArtist>("Artists", schema);
