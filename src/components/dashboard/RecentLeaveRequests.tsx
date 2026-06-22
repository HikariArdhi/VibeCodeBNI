"use client";

import { useEffect, useState } from "react";
import { LeaveStorageService } from "@/services/leave-storage";
import { EmployeeStorageService } from "@/services/employee-storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { LeaveRequest, Employee } from "@/types";
import { Loader2, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export function RecentLeaveRequests() {
  const [recentRequests, setRecentRequests] = useState<LeaveRequest[]>([]);
  const [employeeMap, setEmployeeMap] = useState<Record<string, Employee>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Supabase returns sorted by created_at DESC already
        const allRequests = await LeaveStorageService.getAll();
        const sorted = allRequests.slice(0, 5);
        
        const allEmployees = await EmployeeStorageService.getAll();
        const map: Record<string, Employee> = {};
        for (const emp of allEmployees) {
          map[emp.id] = emp;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecentRequests(sorted);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEmployeeMap(map);
      } catch (error) {
        console.error("Failed to load recent leave requests:", error);
      } finally {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const getEmployeeName = (id: string) => {
    const emp = employeeMap[id];
    return emp ? emp.name : "Unknown Employee";
  };

  if (isLoading) {
    return (
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm flex h-[250px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-300 dark:text-slate-600" />
      </Card>
    );
  }

  return (
    <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl border border-white/40 dark:border-slate-700/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/40 dark:border-slate-700/40 bg-white/30 dark:bg-slate-800/30">
        <div>
          <CardTitle className="text-title text-base text-slate-800 dark:text-slate-100">
            Recent Leave Requests
          </CardTitle>
          <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Latest 5 requests submitted by employees.
          </CardDescription>
        </div>
        <Link 
          href="/leave" 
          className="text-sm font-medium text-primary hover:underline"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {recentRequests.length === 0 ? (
          <div className="flex h-[150px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            No recent leave requests.
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex flex-col flex-1 gap-0.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                    {getEmployeeName(request.employeeId)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(request.startDate)} — {formatDate(request.endDate)}
                  </span>
                </div>
                <StatusBadge status={request.status} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
