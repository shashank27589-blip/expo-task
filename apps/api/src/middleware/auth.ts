import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "./error";
import { verifyToken } from "../utils/jwt";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.header("Authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

    if (!token) {
      throw new AppError(401, "Authentication required");
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      throw new AppError(401, "Invalid session");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(401, "Invalid session"));
  }
}
