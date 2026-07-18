import { z } from "zod";

export const IssueStatus = z.enum(["open", "in_progress", "closed"]);
export const IssuePriority = z.enum(["low", "medium", "high"]);

export const IssueSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).default(""),
  status: IssueStatus,
  priority: IssuePriority,
  labels: z
    .array(
      z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
        error: "labels must be kebab-case",
      }),
    )
    .max(10),
  createdAt: z.date(),
  updatedAt: z.date(),
  closedAt: z.date().nullable(),
});

export type Issue = z.infer<typeof IssueSchema>;

export const CreateIssueBody = IssueSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  closedAt: true,
}).extend({
  priority: IssuePriority.default("medium"),
  labels: IssueSchema.shape.labels.default([]),
});

export type CreateIssuesInput = z.infer<typeof CreateIssueBody>;
