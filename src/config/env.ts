import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.coerce.number(process.env).default(4000),
  DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
