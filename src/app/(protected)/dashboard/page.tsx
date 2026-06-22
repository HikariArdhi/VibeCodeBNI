"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { LeaveStatusChart } from "@/components/dashboard/LeaveStatusChart";
import { DepartmentChart } from "@/components/dashboard/DepartmentChart";
import { RecentLeaveRequests } from "@/components/dashboard/RecentLeaveRequests";
import { LeavesTrendChart } from "@/components/dashboard/LeavesTrendChart";
import { LeaveTypeBreakdownChart } from "@/components/dashboard/LeaveTypeBreakdownChart";
import { DateRangeFilter, type DateRange } from "@/components/shared/DateRangeFilter";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>("6M");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Dashboard"
          description="Overview of employees and leave requests."
        />
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>
      
      {/* Row 1: Summary Stats */}
      <DashboardGrid />
      
      {/* Row 2: Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <DepartmentChart />
        <LeaveStatusChart dateRange={dateRange} />
      </div>

      {/* Row 3: Trend & Breakdown Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <LeavesTrendChart dateRange={dateRange} />
        <LeaveTypeBreakdownChart dateRange={dateRange} />
      </div>
      
      {/* Row 4: Recent Activity */}
      <div className="mt-6">
        <RecentLeaveRequests />
      </div>
    </div>
  );
}
