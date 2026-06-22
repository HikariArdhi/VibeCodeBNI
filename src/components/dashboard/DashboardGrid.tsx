"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { DashboardStatsCard } from "./DashboardStatsCard";
import { Users, Clock, CheckCircle, XCircle, ShieldAlert, CalendarClock } from "lucide-react";
import { AuthStorageService } from "@/services/auth-storage";
import { DashboardSkeleton } from "@/components/shared/Skeleton";
import { StaggerContainer, StaggerItem } from "@/components/shared/StaggerContainer";

export function DashboardGrid() {
  const {
    totalEmployees,
    pendingLeaves,
    approvedLeaves,
    rejectedLeaves,
    nonCompliantBlockLeave,
    myLeaveBalance,
    isLoading,
  } = useDashboard();
  
  const role = AuthStorageService.getRole();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (role === "EMPLOYEE" || role === "SUPERVISOR") {
     return (
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StaggerItem>
            <DashboardStatsCard
              title="My Leave Balance"
              count={myLeaveBalance}
              icon={CalendarClock}
              variant="blue"
            />
          </StaggerItem>
          <StaggerItem>
            <DashboardStatsCard
              title="My Pending Requests"
              count={pendingLeaves}
              icon={Clock}
              variant="amber"
            />
          </StaggerItem>
          <StaggerItem>
            <DashboardStatsCard
              title="My Approved Requests"
              count={approvedLeaves}
              icon={CheckCircle}
              variant="green"
            />
          </StaggerItem>
          <StaggerItem>
            <DashboardStatsCard
              title="My Rejected Requests"
              count={rejectedLeaves}
              icon={XCircle}
              variant="red"
            />
          </StaggerItem>
        </StaggerContainer>
     );
  }

  return (
    <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StaggerItem>
        <DashboardStatsCard
          title="Total Employees"
          count={totalEmployees}
          icon={Users}
          variant="blue"
        />
      </StaggerItem>
      <StaggerItem>
        <DashboardStatsCard
          title="Pending Requests"
          count={pendingLeaves}
          icon={Clock}
          variant="amber"
        />
      </StaggerItem>
      <StaggerItem>
        <DashboardStatsCard
          title="Approved Requests"
          count={approvedLeaves}
          icon={CheckCircle}
          variant="green"
        />
      </StaggerItem>
      <StaggerItem>
        <DashboardStatsCard
          title="Rejected Requests"
          count={rejectedLeaves}
          icon={XCircle}
          variant="red"
        />
      </StaggerItem>
      <StaggerItem>
        <DashboardStatsCard
          title="Block Leave Pending"
          count={nonCompliantBlockLeave}
          icon={ShieldAlert}
          variant="amber"
        />
      </StaggerItem>
    </StaggerContainer>
  );
}
