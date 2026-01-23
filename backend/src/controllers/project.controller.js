import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/projectmember.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

/**
 * GET ALL PROJECTS FOR CURRENT USER
 */
const getProjects = asyncHandler(async (req, res) => {
  const projects = await ProjectMember.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
        pipeline: [
          {
            $lookup: {
              from: "projectmembers",
              localField: "_id",
              foreignField: "project",
              as: "projectmembers",
            },
          },
          {
            $addFields: {
              members: { $size: "$projectmembers" },
            },
          },
        ],
      },
    },
    { $unwind: "$project" },
    {
      $project: {
        _id: 0,
        project: {
          _id: 1,
          name: 1,
          description: 1,
          members: 1,
          createdAt: 1,
          createdBy: 1,
        },
        role: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

/**
 * GET PROJECT BY ID
 */
const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"));
});

/**
 * CREATE PROJECT
 */
const createProject = asyncHandler(async (req, res) => {
  const { name, description, startDate, deadline } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, "Project name is required");
  }

  const existingProject = await Project.findOne({
    name: { $regex: `^${name.trim()}$`, $options: "i" },
  });

  if (existingProject) {
    throw new ApiError(409, "Project with this name already exists");
  }

  const project = await Project.create({
    name: name.trim(),
    description,
    startDate: startDate || Date.now(),
    deadline,
    createdBy: req.user._id,
  });

  await ProjectMember.create({
    user: req.user._id,
    project: project._id,
    role: UserRolesEnum.ADMIN,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

/**
 * UPDATE PROJECT
 */
const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description, startDate, deadline, status } = req.body;

  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      name: name?.trim(),
      description,
      startDate,
      deadline,
      status,
    },
    { new: true, runValidators: true },
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

/**
 * DELETE PROJECT
 */
const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByIdAndDelete(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  await ProjectMember.deleteMany({ project: projectId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Project deleted successfully"));
});

/**
 * ADD MEMBER TO PROJECT
 */
const addMembersToProject = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  await ProjectMember.findOneAndUpdate(
    {
      user: user._id,
      project: projectId,
    },
    {
      user: user._id,
      project: projectId,
      role,
    },
    { upsert: true, new: true },
  );

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Project member added successfully"));
});

/**
 * GET PROJECT MEMBERS
 */
const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const members = await ProjectMember.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user: { $arrayElemAt: ["$user", 0] },
      },
    },
    {
      $project: {
        _id: 0,
        user: 1,
        role: 1,
        createdAt: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, members, "Project members fetched"));
});

/**
 * UPDATE MEMBER ROLE
 */
const updateMemberRole = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const { newRole } = req.body;

  if (!AvailableUserRole.includes(newRole)) {
    throw new ApiError(400, "Invalid role");
  }

  const projectMember = await ProjectMember.findOneAndUpdate(
    {
      project: projectId,
      user: userId,
    },
    { role: newRole },
    { new: true },
  );

  if (!projectMember) {
    throw new ApiError(404, "Project member not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        projectMember,
        "Project member role updated successfully",
      ),
    );
});

/**
 * DELETE PROJECT MEMBER
 */
const deleteMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;

  const projectMember = await ProjectMember.findOneAndDelete({
    project: projectId,
    user: userId,
  });

  if (!projectMember) {
    throw new ApiError(404, "Project member not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Project member removed successfully",
      ),
    );
});

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMembersToProject,
  getProjectMembers,
  updateMemberRole,
  deleteMember,
};
