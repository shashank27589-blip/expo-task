import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  OTP_TTL_MINUTES: z.coerce.number().int().positive().default(10),
  SENDGRID_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().min(1).default(process.env.EMAIL_FROM ?? "no-reply@example.com"),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default("*"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development")
});

export const env = envSchema.parse(process.env);
