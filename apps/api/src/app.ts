import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env";
import { authRouter } from "./routes/auth";
import { projectsRouter } from "./routes/projects";
import { tasksRouter } from "./routes/tasks";
import { errorHandler, notFoundHandler } from "./middleware/error";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN }));
  app.use(express.json());

  if (env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/auth", authRouter);
  app.use("/projects", projectsRouter);
  app.use(tasksRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
