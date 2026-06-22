import type { Employee } from "@/types";
import { supabase } from "@/lib/supabase";

// Map a Supabase row (snake_case) to an Employee object (camelCase)
function mapRowToEmployee(row: Record<string, unknown>): Employee {
  return {
    id: row.id as string,
    name: row.name as string,
    department: row.department as string,
    position: row.position as string,
    annualLeaveBalance: row.annual_leave_balance as number,
    blockLeaveTaken: row.block_leave_taken as boolean,
    dateOfBirth: row.date_of_birth as string | undefined,
  };
}

// Map camelCase Employee fields to snake_case DB columns for insert/update
function mapEmployeeToRow(data: Partial<Omit<Employee, "id">>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (data.name !== undefined) row.name = data.name;
  if (data.department !== undefined) row.department = data.department;
  if (data.position !== undefined) row.position = data.position;
  if (data.annualLeaveBalance !== undefined) row.annual_leave_balance = data.annualLeaveBalance;
  if (data.blockLeaveTaken !== undefined) row.block_leave_taken = data.blockLeaveTaken;
  if (data.dateOfBirth !== undefined) row.date_of_birth = data.dateOfBirth;
  return row;
}

export class EmployeeStorageService {
  static async getAll(): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("name");

      if (error) {
        console.error("Failed to fetch employees:", error);
        return [];
      }

      return (data || []).map(mapRowToEmployee);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      return [];
    }
  }

  static async getById(id: string): Promise<Employee | undefined> {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        return undefined;
      }

      return mapRowToEmployee(data);
    } catch (error) {
      console.error("Failed to fetch employee by id:", error);
      return undefined;
    }
  }

  static async create(data: Omit<Employee, "id" | "annualLeaveBalance" | "blockLeaveTaken">): Promise<Employee> {
    const row = {
      ...mapEmployeeToRow(data),
      annual_leave_balance: 12,
      block_leave_taken: false,
    };

    const { data: inserted, error } = await supabase
      .from("employees")
      .insert(row)
      .select()
      .single();

    if (error || !inserted) {
      throw new Error(`Failed to create employee: ${error?.message || "Unknown error"}`);
    }

    return mapRowToEmployee(inserted);
  }

  static async update(id: string, data: Partial<Omit<Employee, "id">>): Promise<Employee> {
    const row = mapEmployeeToRow(data);

    const { data: updated, error } = await supabase
      .from("employees")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error || !updated) {
      throw new Error(`Employee with id "${id}" not found or update failed: ${error?.message || "Unknown error"}`);
    }

    return mapRowToEmployee(updated);
  }

  static async delete(id: string): Promise<void> {
    // CASCADE in DB handles related leave_requests deletion
    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete employee: ${error.message}`);
    }
  }

  static async search(query: string): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .ilike("name", `%${query}%`);

      if (error) {
        console.error("Failed to search employees:", error);
        return [];
      }

      return (data || []).map(mapRowToEmployee);
    } catch (error) {
      console.error("Failed to search employees:", error);
      return [];
    }
  }
}
