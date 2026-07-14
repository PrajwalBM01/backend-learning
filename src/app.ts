import express from "express";
import router from "./routes";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/app-error";

export const app = express();

app.use(express.json());

app.use("/api/v1", router);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

//404 not found handler before erroHandler.
app.use((req, res, next) => {
  const error = new NotFoundError(`Cannot ${req.method} ${req.url}`);
  next(error);
});

//put it at the last of all the middlewares
app.use(errorHandler);
