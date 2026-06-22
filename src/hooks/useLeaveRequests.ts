import { useState, useEffect, useCallback } from "react";
import { LeaveStorageService } from "@/services/leave-storage";
import { AuthStorageService } from "@/services/auth-storage";
import { EmployeeStorageService } from "@/services/employee-storage";
import type { LeaveRequest, LeaveStatus } from "@/types";
import type { LeaveRequestFormValues } from "@/validators/leave-request-validator";

type StatusFilter = LeaveStatus | "ALL";

type UseLeaveRequestsReturn = {
  leaveRequests: LeaveRequest[];
  loading: boolean;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  createLeaveRequest: (data: LeaveRequestFormValues) => Promise<LeaveRequest>;
  approveLeaveRequest: (id: string) => Promise<LeaveRequest>;
  rejectLeaveRequest: (id: string) => Promise<LeaveRequest>;
  refreshLeaveRequests: () => Promise<void>;
};

export function useLeaveRequests(): UseLeaveRequestsReturn {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const loadLeaveRequests = useCallback(async (filter: StatusFilter) => {
    setLoading(true);
    try {
      let results: LeaveRequest[];
      
      if (filter === "ALL") {
        results = await LeaveStorageService.getAll();
      } else {
        results = await LeaveStorageService.getByStatus(filter);
      }

      const role = AuthStorageService.getRole();
      
      if (role === "EMPLOYEE" || role === "SUPERVISOR") {
        const allEmployees = await EmployeeStorageService.getAll();
        
        if (role === "EMPLOYEE") {
           // EMPLOYEE (Haikal) can only see his own requests
           const haikal = allEmployees.find(e => e.name.toLowerCase().includes("haikal"));
           if (haikal) {
             results = results.filter(r => r.employeeId === haikal.id);
           } else {
             results = [];
           }
        } else if (role === "SUPERVISOR") {
           // SUPERVISOR (Hikari) can see her own requests AND Haikal's requests (to approve)
           const hikari = allEmployees.find(e => e.name.toLowerCase().includes("hikari"));
           const haikal = allEmployees.find(e => e.name.toLowerCase().includes("haikal"));
           
           const allowedIds: string[] = [];
           if (hikari) allowedIds.push(hikari.id);
           if (haikal) allowedIds.push(haikal.id);

           results = results.filter(r => allowedIds.includes(r.employeeId));
        }
      }

      setLeaveRequests(results);
    } catch (error) {
      console.error("Failed to load leave requests:", error);
      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLeaveRequests(statusFilter);
  }, [statusFilter, loadLeaveRequests]);

  const refreshLeaveRequests = useCallback(async () => {
    await loadLeaveRequests(statusFilter);
  }, [statusFilter, loadLeaveRequests]);

  const createLeaveRequest = useCallback(
    async (data: LeaveRequestFormValues): Promise<LeaveRequest> => {
      const request = await LeaveStorageService.create(data);
      await refreshLeaveRequests();
      return request;
    },
    [refreshLeaveRequests]
  );

  const approveLeaveRequest = useCallback(
    async (id: string): Promise<LeaveRequest> => {
      const request = await LeaveStorageService.approve(id);
      await refreshLeaveRequests();
      return request;
    },
    [refreshLeaveRequests]
  );

  const rejectLeaveRequest = useCallback(
    async (id: string): Promise<LeaveRequest> => {
      const request = await LeaveStorageService.reject(id);
      await refreshLeaveRequests();
      return request;
    },
    [refreshLeaveRequests]
  );

  return {
    leaveRequests,
    loading,
    statusFilter,
    setStatusFilter,
    createLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    refreshLeaveRequests,
  };
}
