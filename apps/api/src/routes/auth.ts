import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { AppError } from "../middleware/error";
import { asyncHandler } from "../utils/asyncHandler";
import { compareOtp, generateOtp, hashOtp } from "../utils/otp";
import { sendEmail } from "../utils/email";
import { signToken } from "../utils/jwt";

export const authRouter = Router();

const requestOtpSchema = z.object({
  email: z.string().email().transform((email) => email.toLowerCase()),
  name: z.string().trim().min(1).max(80).optional()
});

const verifyOtpSchema = z.object({
  email: z.string().email().transform((email) => email.toLowerCase()),
  otp: z.string().regex(/^\d{6}$/, "OTP must be a 6 digit code")
});

authRouter.post(
  "/request-otp",
  asyncHandler(async (req, res) => {
    const input = requestOtpSchema.parse(req.body);
    const otp = generateOtp();
    const codeHash = await hashOtp(otp);
    const expiresAt = new Date(Date.now() + env.OTP_TTL_MINUTES * 60 * 1000);

    const user = await prisma.user.upsert({
      where: { email: input.email },
      update: { name: input.name },
      create: { email: input.email, name: input.name }
    });

    await prisma.otpCode.create({
      data: {
        email: input.email,
        codeHash,
        expiresAt,
        userId: user.id
      }
    });

    try {
      await sendEmail({
        to: input.email,
        subject: "Your Task Manager OTP",
        text: `Your verification code is ${otp}. It expires in ${env.OTP_TTL_MINUTES} minutes.`,
        html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in ${env.OTP_TTL_MINUTES} minutes.</p>`
      });
    } catch (error) {
      console.error("Failed to send OTP email", error);
      throw new AppError(500, "Unable to send OTP email");
    }

    if (env.NODE_ENV !== "production") {
      console.log(`OTP for ${input.email}: ${otp}`);
    }

    res.json({
      message: "OTP sent"
    });
  })
);

authRouter.post(
  "/verify-otp",
  asyncHandler(async (req, res) => {
    const input = verifyOtpSchema.parse(req.body);
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        email: input.email,
        consumedAt: null,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: "desc" }
    });

    if (!otpRecord || !(await compareOtp(input.otp, otpRecord.codeHash))) {
      throw new AppError(401, "Invalid or expired OTP");
    }

    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw new AppError(404, "User not found");
    }

    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { consumedAt: new Date() }
    });

    const token = signToken({ sub: user.id, email: user.email });
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user });
  })
);
