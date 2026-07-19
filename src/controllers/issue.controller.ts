import { CreateIssuesInput, Issue } from "../schemas/issue.schema";
import issueServices from "../services/issue.services";

export const issueController = {
  createIssue: async (issue: CreateIssuesInput): Promise<Issue> => {
    const insertedData = await issueServices.insertIssue(issue);
    return insertedData;
  },

  // getIssues: () => {
  //   return issuesServices.findIssues();
  // },

  // getIssueById: (id: string) => {
  //   const issue = issuesServices.findIssuesById(id);
  //   return issue;
  // },

  // removeIssusById: (id: string) => {
  //   return issuesServices.deleteIsssueById(id);
  // },
};
