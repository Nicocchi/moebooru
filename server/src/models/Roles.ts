import { Schema, model } from "mongoose";
import { IRole } from "@types";

const schema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Role = model<IRole>("Roles", schema);
