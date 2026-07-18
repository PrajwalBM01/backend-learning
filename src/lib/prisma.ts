import { env } from "../config/env";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = env.DATABASE_URL;

const adapter = new PrismaNeon({ connectionString });

export const prisma = new PrismaClient({ adapter, log: ["query"] });
