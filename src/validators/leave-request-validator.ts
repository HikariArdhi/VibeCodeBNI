import { z } from "zod";
import { calculateLeaveDays } from "@/lib/utils";

const isBlackoutDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  // Blackout dates: 28th to 31st of any month (Tutup Buku)
  return day >= 28 && day <= 31;
};

export const leaveRequestSchema = z
  .object({
    employeeId: z.string().min(1, "Employee is required"),
    type: z.enum(["ANNUAL_LEAVE", "BLOCK_LEAVE", "SICK_LEAVE"]),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z.string().min(1, "Reason is required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      if (data.type === "BLOCK_LEAVE") {
        return calculateLeaveDays(data.startDate, data.endDate) >= 5;
      }
      return true;
    },
    {
      message: "Mandatory Block Leave requires at least 5 consecutive days",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      // Prevent leaves that start or end during blackout dates
      return !isBlackoutDate(data.startDate) && !isBlackoutDate(data.endDate);
    },
    {
      message: "Cannot take leave during End of Month closing (28th-31st)",
      path: ["startDate"],
    }
  );

export const leaveRequestStorageSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  // Tambahkan catch("ANNUAL_LEAVE") atau opsional sehingga data lama yang tidak punya "type" tidak error
  type: z.enum(["ANNUAL_LEAVE", "BLOCK_LEAVE", "SICK_LEAVE"]).catch("ANNUAL_LEAVE"),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export const leaveRequestListStorageSchema = z.array(leaveRequestStorageSchema);

export type LeaveRequestFormValues = z.infer<typeof leaveRequestSchema>;
