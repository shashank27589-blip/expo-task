import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { AppError } from "../middleware/error";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";

export const projectsRouter = Router();

const projectSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(500)
});

projectsRouter.use(requireAuth);

projectsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const projects = await prisma.project.findMany({
      where: { ownerId: req.user!.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { tasks: true } }
      }
    });

    res.json({ projects });
  })
);

projectsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = projectSchema.parse(req.body);
    const project = await prisma.project.create({
      data: {
        ...input,
        ownerId: req.user!.id
      },
      include: {
        _count: { select: { tasks: true } }
      }
    });

    res.status(201).json({ project });
  })
);

projectsRouter.delete(
  "/:projectId",
  asyncHandler(async (req, res) => {
    const project = await prisma.project.findFirst({
      where: { id: req.params.projectId, ownerId: req.user!.id }
    });

    if (!project) {
      throw new AppError(404, "Project not found");
    }

    await prisma.project.delete({ where: { id: project.id } });
    res.status(204).send();
  })
);
