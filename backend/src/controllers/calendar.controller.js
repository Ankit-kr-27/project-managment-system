import mongoose from "mongoose";
import { Task } from "../models/task.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

/**
 * GET CALENDAR TASKS
 * Fetches tasks with deadlines within a range
 */
const getCalendarTasks = asyncHandler(async (req, res) => {
    const { projectId, start, end } = req.query;

    const query = {
        deadline: { $exists: true, $ne: null },
    };

    if (projectId) {
        query.project = new mongoose.Types.ObjectId(projectId);
    } else {
        // If no project specified, maybe fetch all tasks for user across projects?
        // For now, let's keep it simple: required projectId or fetching assignedTo current User
        query.assignedTo = req.user._id;
    }

    if (start && end) {
        query.deadline = {
            $gte: new Date(start),
            $lte: new Date(end),
        };
    }

    const tasks = await Task.find(query)
        .select("title deadline status priority project")
        .populate("project", "name");

    return res
        .status(200)
        .json(new ApiResponse(200, tasks, "Calendar tasks fetched successfully"));
});

export { getCalendarTasks };
