
import { z } from "zod";

export const projectSetupSchema = z.object({
  projectName: z.string()
    .min(3, "Project name must be at least 3 characters long")
    .max(50, "Project name must be less than 50 characters"),
  projectCode: z.string()
    .min(4, "Project code must be at least 4 characters")
    .max(10, "Project code must be less than 10 characters"),
  apiKey: z.string().optional(),
  dbKey: z.string().optional(),
});

export type ProjectSetupFormValues = z.infer<typeof projectSetupSchema>;
