import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { ZodError } from "zod";

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

  //operational errors
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statuscode).json({
      success: false,
      error: { code: err.statuscode, message: err.message },
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
  res.status(500).json({
    success: false,
    error: { message: "Internal server error" },
  });
}
