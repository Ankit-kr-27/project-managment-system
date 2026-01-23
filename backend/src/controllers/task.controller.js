import mongoose from "mongoose";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import { Subtask } from "../models/subtask.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

/**
 * GET TASKS BY PROJECT
 * GET /api/v1/tasks/project/:projectId
 */
const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  })
    .populate("assignedTo", "username fullName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

/**
 * CREATE TASK
 * POST /api/v1/tasks/project/:projectId
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status, deadline, assignedToEmail } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const files = req.files || [];

  const attachments = files.map((file) => ({
    url: `${process.env.SERVER_URL}/images/${file.filename}`,
    mimetype: file.mimetype,
    size: file.size,
  }));

  let assignedToId = assignedTo;

  if (assignedToEmail) {
    const user = await User.findOne({ email: assignedToEmail });
    if (!user) {
      throw new ApiError(404, "User with this email not found");
    }
    assignedToId = user._id;
  }

  const task = await Task.create({
    title,
    description,
    project: project._id,
    assignedTo: assignedToId
      ? new mongoose.Types.ObjectId(assignedToId)
      : undefined,
    status,
    deadline,
    assignedBy: req.user._id,
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

/**
 * GET TASK BY ID (WITH SUBTASKS)
 * GET /api/v1/tasks/:taskId
 */
const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
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
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
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
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);

  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "Task fetched successfully"));
});

/**
 * UPDATE TASK
 * PUT /api/v1/tasks/:taskId
 */
const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findByIdAndUpdate(
    taskId,
    { ...req.body },
    { new: true },
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

/**
 * DELETE TASK
 * DELETE /api/v1/tasks/:taskId
 */
const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await Subtask.deleteMany({ task: task._id });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

/**
 * CREATE SUBTASK
 */
const createSubTask = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subtask = await Subtask.create({
    title,
    task: task._id,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subtask, "Subtask created successfully"));
});

/**
 * UPDATE SUBTASK
 */
const updateSubTask = asyncHandler(async (req, res) => {
  const { subtaskId } = req.params;

  const subtask = await Subtask.findByIdAndUpdate(
    subtaskId,
    { ...req.body },
    { new: true },
  );

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subtask, "Subtask updated successfully"));
});

/**
 * DELETE SUBTASK
 */
const deleteSubTask = asyncHandler(async (req, res) => {
  const { subtaskId } = req.params;

  const subtask = await Subtask.findByIdAndDelete(subtaskId);
  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subtask deleted successfully"));
});

const assignTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { assignedTo } = req.body;

  const task = await Task.findByIdAndUpdate(
    taskId,
    { assignedTo },
    { new: true }
  ).populate("assignedTo", "username email");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task assigned successfully"));
});

/**
 * GET TASKS ASSIGNED TO ME
 * GET /api/v1/tasks/my-tasks
 */
const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    assignedTo: req.user._id,
  })
    .populate("project", "name")
    .populate("assignedBy", "username fullName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Your tasks fetched successfully"));
});


export {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
  assignTask,
  getMyTasks,
};
