import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getCalendarTasks } from "../controllers/calendar.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getCalendarTasks);

export default router;
