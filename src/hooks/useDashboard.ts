import { useState, useEffect, useCallback } from "react";
import { EmployeeStorageService } from "@/services/employee-storage";
import { LeaveStorageService } from "@/services/leave-storage";
import { AuthStorageService } from "@/services/auth-storage";

type UseDashboardReturn = {
  totalEmployees: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  nonCompliantBlockLeave: number;
  myLeaveBalance: number;
  isLoading: boolean;
  refresh: () => void;
};

export function useDashboard(): UseDashboardReturn {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [approvedLeaves, setApprovedLeaves] = useState(0);
  const [rejectedLeaves, setRejectedLeaves] = useState(0);
  const [nonCompliantBlockLeave, setNonCompliantBlockLeave] = useState(0);
  const [myLeaveBalance, setMyLeaveBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const calculateStats = useCallback(async () => {
    try {
      const employees = await EmployeeStorageService.getAll();
      const pending = await LeaveStorageService.getByStatus("PENDING");
      const approved = await LeaveStorageService.getByStatus("APPROVED");
      const rejected = await LeaveStorageService.getByStatus("REJECTED");
      
      // For demo: Match specific user roles to their respective dummy employee records
      const role = AuthStorageService.getRole();
      if (role === "EMPLOYEE" || role === "SUPERVISOR") {
        let activeEmployeeId = null;
        if (employees.length > 0) {
          const keyword = role === "EMPLOYEE" ? "haikal" : "hikari";
          const matchedEmp = employees.find(e => e.name.toLowerCase().includes(keyword));
          if (matchedEmp) {
             activeEmployeeId = matchedEmp.id;
          } else {
             activeEmployeeId = employees[0].id;
          }
        }

        if (activeEmployeeId) {
          const emp = employees.find(e => e.id === activeEmployeeId);
          setMyLeaveBalance(emp ? emp.annualLeaveBalance : 12);
          // Filter leave counts to only show this user's data
          setPendingLeaves(pending.filter(r => r.employeeId === activeEmployeeId).length);
          setApprovedLeaves(approved.filter(r => r.employeeId === activeEmployeeId).length);
          setRejectedLeaves(rejected.filter(r => r.employeeId === activeEmployeeId).length);
        } else {
          setMyLeaveBalance(12);
          setPendingLeaves(0);
          setApprovedLeaves(0);
          setRejectedLeaves(0);
        }
      } else {
        // Manager sees all data
        setPendingLeaves(pending.length);
        setApprovedLeaves(approved.length);
        setRejectedLeaves(rejected.length);
      }

      setTotalEmployees(employees.length);
      setNonCompliantBlockLeave(employees.filter(e => !e.blockLeaveTaken).length);
    } catch (error) {
      console.error("Failed to calculate dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    calculateStats();
  }, [calculateStats]);

  return {
    totalEmployees,
    pendingLeaves,
    approvedLeaves,
    rejectedLeaves,
    nonCompliantBlockLeave,
    myLeaveBalance,
    isLoading,
    refresh: calculateStats,
  };
}
