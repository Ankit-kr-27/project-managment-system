import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

// basic configurations
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// cors configurations
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//import routes
import healthCheckRouter from "./routes/healthcheck.route.js";
import authRouter from "./routes/auth.route.js";
import projectRouter from "./routes/project.route.js";
import taskRouter from "./routes/task.route.js";
import organizationRouter from "./routes/organization.route.js";
import analyticsRouter from "./routes/analytics.route.js";
import calendarRouter from "./routes/calendar.route.js";

//route middlewares
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/organizations", organizationRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/calendar", calendarRouter);

app.get("/", (req, res) => {
  res.send("Welcome to basecampy");
});

import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);

export default app;