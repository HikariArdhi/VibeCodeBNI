"use client";

import { useLeaveRequests } from "@/hooks/useLeaveRequests";
import { PageHeader } from "@/components/shared/PageHeader";
import { LeaveRequestTable } from "@/components/leave/LeaveRequestTable";
import { LeaveRequestFilter } from "@/components/leave/LeaveRequestFilter";
import { EmptyState } from "@/components/shared/EmptyState";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays, Loader2, Download } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AuthStorageService } from "@/services/auth-storage";
import { EmployeeStorageService } from "@/services/employee-storage";
import { exportLeaveRequestsToExcel } from "@/lib/export-excel";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function LeavePage() {
  const {
    leaveRequests,
    loading,
    statusFilter,
    setStatusFilter,
    approveLeaveRequest,
    rejectLeaveRequest,
  } = useLeaveRequests();

  const [isManager, setIsManager] = useState(false);
  const [employeeMap, setEmployeeMap] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsManager(AuthStorageService.getRole() === "MANAGER");

    const loadEmployees = async () => {
      const employees = await EmployeeStorageService.getAll();
      const map: Record<string, string> = {};
      for (const emp of employees) {
        map[emp.id] = emp.name;
      }
      setEmployeeMap(map);
    };
    loadEmployees();
  }, []);

  const handleExport = () => {
    if (leaveRequests.length === 0) {
      toast.error("Tidak ada data untuk di-export.");
      return;
    }
    exportLeaveRequestsToExcel(leaveRequests, employeeMap);
    toast.success("Data cuti berhasil di-export ke Excel!");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Requests"
        description="Manage employee leave requests."
        action={
          <div className="flex items-center gap-2">
            {isManager && (
              <Button
                variant="outline"
                className="rounded-full shadow-sm"
                onClick={handleExport}
                disabled={loading}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
            )}
            <Link
              href="/leave/new"
              className={cn(buttonVariants({ variant: "default" }), "rounded-full shadow-md")}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </div>
        }
      />

      <LeaveRequestFilter value={statusFilter} onChange={setStatusFilter} />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : leaveRequests.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={
            statusFilter === "ALL"
              ? "No leave requests yet"
              : `No ${statusFilter.toLowerCase()} requests`
          }
          description={
            statusFilter === "ALL"
              ? "Submit a new leave request to get started."
              : `There are no leave requests with "${statusFilter}" status.`
          }
          action={
            statusFilter === "ALL" ? (
              <Link
                href="/leave/new"
                className={cn(buttonVariants({ variant: "default" }), "rounded-full shadow-md")}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Link>
            ) : undefined
          }
        />
      ) : (
        <LeaveRequestTable
          leaveRequests={leaveRequests}
          onApprove={approveLeaveRequest}
          onReject={rejectLeaveRequest}
        />
      )}
    </div>
  );
}
