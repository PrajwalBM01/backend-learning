import { CreateIssuesInput, Issue } from "../schemas/issue.schema";
import { issuesServices } from "../store/issue.store";

export const isssueContoller = {
  createIssue: (issue: CreateIssuesInput): Issue => {
    const insertedData = issuesServices.insertIssue(issue);
    return insertedData;
  },

  getIssues: () => {
    return issuesServices.findIssues();
  },

  getIssueById: (id: string) => {
    const issue = issuesServices.findIssuesById(id);
    return issue;
  },

  removeIssusById: (id: string) => {
    return issuesServices.deleteIsssueById(id);
  },
};
