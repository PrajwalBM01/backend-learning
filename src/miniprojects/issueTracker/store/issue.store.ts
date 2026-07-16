import { CreateIssuesInput, Issue } from "../schemas/issue.schema";
import crypto from "node:crypto";
const issues = new Map<string, Issue>();

export const issuesServices = {
  insertIssue: (input: CreateIssuesInput): Issue => {
    const now = new Date();
    const issue: Issue = {
      id: crypto.randomUUID(),
      ...input,
      status: "open",
      createdAt: now,
      updatedAt: now,
      closedAt: null,
    };
    issues.set(issue.id, issue);
    return issue;
  },

  findIssues: () => {
    return Array.from(issues);
  },

  findIssuesById: (id: string): Issue | undefined => {
    const issue = issues.get(id);
    return issue;
  },

  deleteIsssueById: (id: string) => {
    return issues.delete(id);
  },
};
