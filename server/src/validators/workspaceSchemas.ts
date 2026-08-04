import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  description: z.string().max(500).trim().optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  description: z.string().max(500).trim().optional(),
});

export const joinWorkspaceSchema = z.object({
  inviteCode: z.string().min(4).max(20).trim(),
});