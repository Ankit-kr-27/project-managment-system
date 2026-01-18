import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ProjectMember } from "../models/projectmember.model.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

/**
 * VERIFY JWT
 * Reads token from cookie or Authorization header
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});

/**
 * VALIDATE PROJECT PERMISSION
 * - No roles passed → any project member allowed
 * - Roles passed → role-based restriction
 */
export const validateProjectPermission = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(400, "Project ID is missing");
    }

    const projectMember = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!projectMember) {
      throw new ApiError(403, "You are not a member of this project");
    }

    const userRole = projectMember.role;
    req.user.role = userRole;

    // 🔥 IMPORTANT: Allow all members if roles array is empty
    if (roles.length > 0 && !roles.includes(userRole)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action"
      );
    }

    next();
  });
};
