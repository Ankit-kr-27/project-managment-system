import mongoose, { Schema } from "mongoose";
import { ProjectStatusEnum, AvailableProjectStatuses } from "../utils/constants.js";


const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    deadline: {
      type: Date,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: AvailableProjectStatuses,
      default: ProjectStatusEnum.ACTIVE,
    },

  },
  { timestamps: true },
);

export const Project = mongoose.model("Project", projectSchema);
