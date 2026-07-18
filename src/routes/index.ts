import { Router } from "express";
import issueRouter from "./issue.route";

const router = Router();

router.use("/issues", issueRouter);

export default router;
