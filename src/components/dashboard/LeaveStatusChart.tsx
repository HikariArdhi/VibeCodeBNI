"use client";

import { useEffect, useState } from "react";
import { LeaveStorageService } from "@/services/leave-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Loader2 } from "lucide-react";
import { type DateRange, getDateFromRange } from "@/components/shared/DateRangeFilter";

const COLORS = {
  PENDING: "#f59e0b",
  APPROVED: "#10b981",
  REJECTED: "#ef4444",
};

interface LeaveStatusChartProps {
  dateRange?: DateRange;
}

export function LeaveStatusChart({ dateRange = "1Y" }: LeaveStatusChartProps) {
  const [data, setData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const requests = await LeaveStorageService.getAll();
        const rangeStart = getDateFromRange(dateRange);

        const filtered = requests.filter(r => new Date(r.startDate) >= rangeStart);

        const pending = filtered.filter((r) => r.status === "PENDING").length;
        const approved = filtered.filter((r) => r.status === "APPROVED").length;
        const rejected = filtered.filter((r) => r.status === "REJECTED").length;

        const chartData = [
          { name: "Pending", value: pending, color: COLORS.PENDING },
          { name: "Approved", value: approved, color: COLORS.APPROVED },
          { name: "Rejected", value: rejected, color: COLORS.REJECTED },
        ].filter((item) => item.value > 0);

        setData(chartData);
      } catch (error) {
        console.error("Failed to load leave status chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [dateRange]);

  if (isLoading) {
    return (
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm flex h-[350px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-300 dark:text-slate-600" />
      </Card>
    );
  }

  return (
    <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl border border-white/40 dark:border-slate-700/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-[350px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-title text-base text-slate-800 dark:text-slate-100">
          Leave Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            No leave requests in this range.
          </div>
        ) : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 500 }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
