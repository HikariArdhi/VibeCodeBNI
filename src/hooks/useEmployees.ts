import { useState, useEffect, useCallback } from "react";
import { EmployeeStorageService } from "@/services/employee-storage";
import type { Employee } from "@/types";
import type { EmployeeFormValues } from "@/validators/employee-validator";

type UseEmployeesReturn = {
  employees: Employee[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  createEmployee: (data: EmployeeFormValues) => Promise<Employee>;
  updateEmployee: (id: string, data: Partial<EmployeeFormValues>) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<void>;
  refreshEmployees: () => Promise<void>;
};

export function useEmployees(): UseEmployeesReturn {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadEmployees = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const results = query.trim()
        ? await EmployeeStorageService.search(query)
        : await EmployeeStorageService.getAll();

      setEmployees(results);
    } catch (error) {
      console.error("Failed to load employees:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEmployees(searchQuery);
  }, [searchQuery, loadEmployees]);

  const refreshEmployees = useCallback(async () => {
    await loadEmployees(searchQuery);
  }, [searchQuery, loadEmployees]);

  const createEmployee = useCallback(
    async (data: EmployeeFormValues): Promise<Employee> => {
      const employee = await EmployeeStorageService.create(data);
      await refreshEmployees();
      return employee;
    },
    [refreshEmployees]
  );

  const updateEmployee = useCallback(
    async (id: string, data: Partial<EmployeeFormValues>): Promise<Employee> => {
      const employee = await EmployeeStorageService.update(id, data);
      await refreshEmployees();
      return employee;
    },
    [refreshEmployees]
  );

  const deleteEmployee = useCallback(
    async (id: string): Promise<void> => {
      await EmployeeStorageService.delete(id);
      await refreshEmployees();
    },
    [refreshEmployees]
  );

  return {
    employees,
    loading,
    searchQuery,
    setSearchQuery,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    refreshEmployees,
  };
}
