"use client";

import { useEffect, useState } from "react";
import { LeaveRequest, Employee } from "@/types";
import { EmployeeStorageService } from "@/services/employee-storage";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate, calculateLeaveDays } from "@/lib/utils";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import { AuthStorageService } from "@/services/auth-storage";
import { FadeIn } from "@/components/shared/FadeIn";
import { fireConfetti } from "@/lib/confetti";

interface LeaveRequestTableProps {
  leaveRequests: LeaveRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function LeaveRequestTable({
  leaveRequests,
  onApprove,
  onReject,
}: LeaveRequestTableProps) {
  const role = AuthStorageService.getRole();
  const [employeeMap, setEmployeeMap] = useState<Record<string, Employee>>({});

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const allEmployees = await EmployeeStorageService.getAll();
        const map: Record<string, Employee> = {};
        for (const emp of allEmployees) {
          map[emp.id] = emp;
        }
        setEmployeeMap(map);
      } catch (error) {
        console.error("Failed to load employees for table:", error);
      }
    };
    loadEmployees();
  }, [leaveRequests]);

  const getEmployeeName = (id: string) => {
    const employee = employeeMap[id];
    return employee ? employee.name : "Unknown Employee";
  };

  const getEmployeeBalance = (id: string) => {
    const employee = employeeMap[id];
    return employee ? employee.annualLeaveBalance : 0;
  };

  const handleApprove = (requestId: string) => {
    fireConfetti();
    onApprove(requestId);
  };

  return (
    <div className="space-y-4">
      {leaveRequests.map((request, index) => (
        <FadeIn key={request.id} delay={index * 0.08} direction="up">
          <div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl border border-white/60 dark:border-slate-700/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
          >
            {/* Main Info */}
            <div className="flex items-start md:items-center gap-5 flex-1">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/40">
                <Calendar className="h-6 w-6" />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-headline text-slate-800 dark:text-slate-100">{getEmployeeName(request.employeeId)}</h3>
                  <StatusBadge status={request.status} />
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 bg-white/50 dark:bg-slate-700/50 px-2.5 py-1 rounded-full border border-slate-200/50 dark:border-slate-600/50">
                    <span className="font-medium">{formatDate(request.startDate)}</span>
                    <span className="text-slate-400 dark:text-slate-500">→</span>
                    <span className="font-medium">{formatDate(request.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                    • {calculateLeaveDays(request.startDate, request.endDate)} Days
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                    • {request.type?.replace("_", " ")}
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                    Balance: {getEmployeeBalance(request.employeeId)} days
                  </div>
                </div>
                
                {request.reason && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 italic">
                    &quot;{request.reason}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200/50 dark:border-slate-700/50">
              {/* Show actions only for Manager, or for Supervisor IF the request belongs to someone else (Haikal) */}
              {(role === "MANAGER" || (role === "SUPERVISOR" && !getEmployeeName(request.employeeId).toLowerCase().includes("hikari"))) ? (
                request.status === "PENDING" ? (
                  <>
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="flex flex-1 md:flex-none items-center justify-center gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 transition-colors hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(request.id)}
                      className="flex flex-1 md:flex-none items-center justify-center gap-2 rounded-2xl bg-red-50 dark:bg-red-950/40 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-500 hover:text-white dark:hover:bg-red-600"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </>
                ) : (
                  <div className="flex h-10 items-center px-4 text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                    Processed
                  </div>
                )
              ) : null}
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
