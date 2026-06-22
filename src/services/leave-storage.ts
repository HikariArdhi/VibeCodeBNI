import type { LeaveRequest, LeaveStatus, LeaveType } from "@/types";
import { calculateLeaveDays } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// Map a Supabase row (snake_case) to a LeaveRequest object (camelCase)
function mapRowToLeaveRequest(row: Record<string, unknown>): LeaveRequest {
  return {
    id: row.id as string,
    employeeId: row.employee_id as string,
    type: row.type as LeaveType,
    startDate: row.start_date as string,
    endDate: row.end_date as string,
    reason: row.reason as string,
    status: row.status as LeaveStatus,
  };
}

// Map camelCase LeaveRequest fields to snake_case DB columns for insert
function mapLeaveRequestToRow(data: Partial<Omit<LeaveRequest, "id">>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (data.employeeId !== undefined) row.employee_id = data.employeeId;
  if (data.type !== undefined) row.type = data.type;
  if (data.startDate !== undefined) row.start_date = data.startDate;
  if (data.endDate !== undefined) row.end_date = data.endDate;
  if (data.reason !== undefined) row.reason = data.reason;
  if (data.status !== undefined) row.status = data.status;
  return row;
}

export class LeaveStorageService {
  static async getAll(): Promise<LeaveRequest[]> {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch leave requests:", error);
        return [];
      }

      return (data || []).map(mapRowToLeaveRequest);
    } catch (error) {
      console.error("Failed to fetch leave requests:", error);
      return [];
    }
  }

  static async getById(id: string): Promise<LeaveRequest | undefined> {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        return undefined;
      }

      return mapRowToLeaveRequest(data);
    } catch (error) {
      console.error("Failed to fetch leave request by id:", error);
      return undefined;
    }
  }

  static async create(data: Omit<LeaveRequest, "id" | "status">): Promise<LeaveRequest> {
    const row = {
      ...mapLeaveRequestToRow(data),
      status: "PENDING",
    };

    const { data: inserted, error } = await supabase
      .from("leave_requests")
      .insert(row)
      .select()
      .single();

    if (error || !inserted) {
      throw new Error(`Failed to create leave request: ${error?.message || "Unknown error"}`);
    }

    return mapRowToLeaveRequest(inserted);
  }

  static async approve(id: string): Promise<LeaveRequest> {
    // Fetch the leave request first
    const { data: requestData, error: fetchError } = await supabase
      .from("leave_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !requestData) {
      throw new Error(`Leave request with id "${id}" not found`);
    }

    const request = mapRowToLeaveRequest(requestData);

    // Banking logic: adjust leave quota and block leave compliance
    const { data: employeeData, error: empError } = await supabase
      .from("employees")
      .select("*")
      .eq("id", request.employeeId)
      .single();

    if (!empError && employeeData) {
      const days = calculateLeaveDays(request.startDate, request.endDate);
      const updates: Record<string, unknown> = {};

      if (request.type === "ANNUAL_LEAVE") {
        updates.annual_leave_balance = Math.max(0, (employeeData.annual_leave_balance as number) - days);
      } else if (request.type === "BLOCK_LEAVE") {
        updates.block_leave_taken = true;
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from("employees")
          .update(updates)
          .eq("id", request.employeeId);

        if (updateError) {
          console.error("Failed to update employee leave balance:", updateError);
        }
      }
    }

    // Update the leave request status to APPROVED
    const { data: updated, error: approveError } = await supabase
      .from("leave_requests")
      .update({ status: "APPROVED" })
      .eq("id", id)
      .select()
      .single();

    if (approveError || !updated) {
      throw new Error(`Failed to approve leave request: ${approveError?.message || "Unknown error"}`);
    }

    return mapRowToLeaveRequest(updated);
  }

  static async reject(id: string): Promise<LeaveRequest> {
    const { data: updated, error } = await supabase
      .from("leave_requests")
      .update({ status: "REJECTED" })
      .eq("id", id)
      .select()
      .single();

    if (error || !updated) {
      throw new Error(`Leave request with id "${id}" not found or reject failed: ${error?.message || "Unknown error"}`);
    }

    return mapRowToLeaveRequest(updated);
  }

  static async getByStatus(status: LeaveStatus): Promise<LeaveRequest[]> {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("*")
        .eq("status", status);

      if (error) {
        console.error("Failed to fetch leave requests by status:", error);
        return [];
      }

      return (data || []).map(mapRowToLeaveRequest);
    } catch (error) {
      console.error("Failed to fetch leave requests by status:", error);
      return [];
    }
  }

  static async getByEmployee(employeeId: string): Promise<LeaveRequest[]> {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("*")
        .eq("employee_id", employeeId);

      if (error) {
        console.error("Failed to fetch leave requests by employee:", error);
        return [];
      }

      return (data || []).map(mapRowToLeaveRequest);
    } catch (error) {
      console.error("Failed to fetch leave requests by employee:", error);
      return [];
    }
  }

  static async deleteByEmployee(employeeId: string): Promise<void> {
    const { error } = await supabase
      .from("leave_requests")
      .delete()
      .eq("employee_id", employeeId);

    if (error) {
      console.error("Failed to delete leave requests for employee:", error);
    }
  }
}
