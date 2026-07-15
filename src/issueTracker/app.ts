import express from "express";
import { errorHandler } from "../middlewares/error-handler";
import { NotFoundError } from "../errors/app-error";

export const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running properly",
  });
});

app.use((req, res, next) => {
  const error = new NotFoundError(`Cannot ${req.method} ${req.url}`);
  next(error);
});

app.use(errorHandler);
