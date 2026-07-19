import { Prisma } from "../generated/prisma/client";
import { AppError } from "./app-error";

export function mapPrismaError(err: unknown): AppError | null {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        // Unique constraint violation. meta.target tells you which field(s).
        const fields =
          (err.meta?.target as string[] | undefined)?.join(", ") ?? "field";
        return new AppError(`A record with this ${fields} already exists`, 409);
      }
      case "P2025":
        // Record not found (update/delete on a missing row, findUniqueOrThrow)
        return new AppError("Resource not found", 404);
      case "P2003":
        // Foreign key violation — e.g. creating a comment for a nonexistent issue
        return new AppError("Related resource does not exist", 400);
      case "P2000":
        return new AppError("Value too long for field", 400);
      case "P2034":
        // Transaction conflict/deadlock — retryable; if it reaches here, surface as 409
        return new AppError(
          "Operation conflicted with another request, please retry",
          409,
        );
      default:
        // Known DB error we haven't mapped — treat as server fault, log the code
        return new AppError("Database request failed", 500);
    }
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    // Our code called Prisma wrongly — programmer error, never the client's fault
    return new AppError("Internal data validation error", 500);
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return new AppError("Database unavailable", 503);
  }

  return null;
}
