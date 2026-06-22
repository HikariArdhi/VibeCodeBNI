import { z } from "zod";

export const employeeSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters")
    .trim(),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  annualLeaveBalance: z.number().min(0, "Balance cannot be negative").optional(),
  blockLeaveTaken: z.boolean().optional(),
  dateOfBirth: z.string().optional(),
});

export const employeeStorageSchema = z.object({
  id: z.string(),
  name: z.string(),
  department: z.string(),
  position: z.string(),
  annualLeaveBalance: z.number().default(12),
  blockLeaveTaken: z.boolean().default(false),
});

export const employeeListStorageSchema = z.array(employeeStorageSchema);

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
