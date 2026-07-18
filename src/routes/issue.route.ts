import { Router } from "express";
import { CreateIssueBody, CreateIssuesInput } from "../schemas/issue.schema";
import { isssueContoller } from "../controllers/issue.controller";
import { success } from "zod";

const router = Router();

//get all the issues
// router.get("/", (req, res) => {
//   const issues = isssueContoller.getIssues();

//   res.status(201).json({
//     success: true,
//     data: issues,
//   });
// });

//get issue by id
// router.get("/:id", (req, res) => {
//   const issueId = req.params;
//   const issue = isssueContoller.getIssueById(issueId.id);

//   if (!issue) {
//     return res.status(204).json({
//       success: false,
//       message: "not found",
//     });
//   }
//   return res.status(201).json({
//     success: true,
//     data: issue,
//   });
// });

//create an issue
router.post("/", async (req, res) => {
  const body: CreateIssuesInput = CreateIssueBody.parse(req.body);
  const newIssue = await isssueContoller.createIssue(body);

  return res.status(201).json({
    success: true,
    data: newIssue,
  });
});

//update an issue

//delete an issue
// router.delete("/:id", (req, res) => {
//   const id = req.params;
//   const result = isssueContoller.removeIssusById(id.id);
//   if (result) {
//     return res.status(200).json({
//       success: true,
//       message: "Issue deleted.",
//     });
//   }
// });

export default router;
