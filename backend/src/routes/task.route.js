import { Router } from "express";
import {
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
} from "../controllers/task.controller.js";

import { verifyJWT, validateProjectPermission } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { UserRolesEnum } from "../utils/constants.js";

const router = Router();

/**
 * All task routes are protected
 */
router.use(verifyJWT);

/**
 * TASKS BY PROJECT
 * /api/v1/tasks/project/:projectId
 */
router
  .route("/project/:projectId")
  .get(
    validateProjectPermission(), // any project member
    getTasks
  )
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    upload.array("attachments", 5),
    createTask
  );

/**
 * SINGLE TASK
 * /api/v1/tasks/:taskId
 */
router
  .route("/:taskId")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

/**
 * SUBTASKS
 */
router.post(
  "/:taskId/subtasks",
  validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
  createSubTask
);

router
  .route("/subtasks/:subtaskId")
  .put(updateSubTask)
  .delete(deleteSubTask);

router.patch("/:taskId/assign", assignTask);

router.route("/assigned/me").get(getMyTasks);



export default router;
