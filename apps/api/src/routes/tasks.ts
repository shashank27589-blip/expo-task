import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { AppError } from "../middleware/error";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";

export const tasksRouter = Router();

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(160),
  dueDate: z.string().datetime().optional().nullable()
});

const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  status: z.enum(["pending", "completed"]).optional(),
  dueDate: z.string().datetime().optional().nullable()
});

tasksRouter.use(requireAuth);

tasksRouter.get(
  "/projects/:projectId/tasks",
  asyncHandler(async (req, res) => {
    await assertOwnsProject(req.user!.id, req.params.projectId);
    const tasks = await prisma.task.findMany({
      where: { projectId: req.params.projectId },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }]
    });

    res.json({ tasks });
  })
);

tasksRouter.post(
  "/projects/:projectId/tasks",
  asyncHandler(async (req, res) => {
    await assertOwnsProject(req.user!.id, req.params.projectId);
    const input = createTaskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: {
        title: input.title,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        projectId: req.params.projectId
      }
    });

    res.status(201).json({ task });
  })
);

tasksRouter.patch(
  "/tasks/:taskId",
  asyncHandler(async (req, res) => {
    const input = updateTaskSchema.parse(req.body);
    const task = await findOwnedTask(req.user!.id, req.params.taskId);

    const updated = await prisma.task.update({
      where: { id: task.id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.dueDate !== undefined ? { dueDate: input.dueDate ? new Date(input.dueDate) : null } : {})
      }
    });

    res.json({ task: updated });
  })
);

tasksRouter.delete(
  "/tasks/:taskId",
  asyncHandler(async (req, res) => {
    const task = await findOwnedTask(req.user!.id, req.params.taskId);
    await prisma.task.delete({ where: { id: task.id } });
    res.status(204).send();
  })
);

async function assertOwnsProject(userId: string, projectId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId: userId },
    select: { id: true }
  });

  if (!project) {
    throw new AppError(404, "Project not found");
  }
}

async function findOwnedTask(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: { ownerId: userId }
    }
  });

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  return task;
}
