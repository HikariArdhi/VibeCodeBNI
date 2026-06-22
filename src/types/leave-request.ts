export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export type LeaveType = "ANNUAL_LEAVE" | "BLOCK_LEAVE" | "SICK_LEAVE";

export type LeaveRequest = {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
};
