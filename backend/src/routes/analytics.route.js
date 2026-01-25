import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getProjectAnalytics } from "../controllers/analytics.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/project/:projectId").get(getProjectAnalytics);

export default router;
