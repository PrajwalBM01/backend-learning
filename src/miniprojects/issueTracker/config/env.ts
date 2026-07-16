import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.coerce.number(process.env).default(4000),
});

export const env = envSchema.parse(process.env);
