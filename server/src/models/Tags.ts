import { Schema, model } from "mongoose";
import { ITag } from "@types";

const schema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Tag = model<ITag>("Tags", schema);
