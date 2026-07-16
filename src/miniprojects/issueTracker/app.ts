import express from "express";
import { errorHandler } from "../../playground/middlewares/error-handler";
import { NotFoundError } from "../../playground/errors/app-error";
import routes from "./routes/index";

export const app = express();

app.use(express.json());

app.use("/api/v1", routes);

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
