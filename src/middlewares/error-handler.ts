import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { ZodError } from "zod";
import { mapPrismaError } from "../errors/prisma-error-handler";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //if header alredy went out, we cant not change it
  if (res.headersSent) {
    return next(err);
  }

  //mapping prisma errors
  const mapped = mapPrismaError(err);
  const error = mapped ?? err;

  //operational errors
  if (error instanceof AppError && error.isOperational) {
    return res.status(error.statuscode).json({
      success: false,
      error: { code: error.statuscode, message: error.message },
    });
  }

  //zoderrors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Validation failed",
        issues: err.issues,
      },
    });
  }

  //programming errors
  console.error("UNEXPECTED ERROR", err);
  res.status(mapped && !mapped.isOperational ? mapped.statuscode : 500).json({
    success: false,
    error: {
      message:
        mapped?.isOperational === false
          ? mapped.message
          : "Internal server error",
    },
  });
}
