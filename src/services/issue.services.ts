import { prisma } from "../lib/prisma";
import { CreateIssuesInput } from "../schemas/issue.schema";

const issueServices = {
  insertIssue: async (input: CreateIssuesInput) => {
    const issue = await prisma.issues.create({
      data: {
        title: input.title,
        description: input.description,
        priority: input.priority,
        labels: input.labels,
      },
    });
    return issue;
  },
};

export default issueServices;
