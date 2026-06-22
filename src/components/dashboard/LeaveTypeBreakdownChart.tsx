"use client";

import { useEffect, useState } from "react";
import { LeaveStorageService } from "@/services/leave-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Loader2 } from "lucide-react";
import { type DateRange, getDateFromRange } from "@/components/shared/DateRangeFilter";

const TYPE_COLORS = {
  "Annual Leave": "#818cf8",
  "Block Leave": "#f59e0b",
  "Sick Leave": "#f43f5e",
};

interface LeaveTypeBreakdownChartProps {
  dateRange?: DateRange;
}

export function LeaveTypeBreakdownChart({ dateRange = "1Y" }: LeaveTypeBreakdownChartProps) {
  const [data, setData] = useState<{ name: string; "Annual Leave": number; "Block Leave": number; "Sick Leave": number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allRequests = await LeaveStorageService.getAll();
        const rangeStart = getDateFromRange(dateRange);

        const filtered = allRequests.filter(r => new Date(r.startDate) >= rangeStart);

        const statusData = ["PENDING", "APPROVED", "REJECTED"].map(status => {
          const statusRequests = filtered.filter(r => r.status === status);
          return {
            name: status.charAt(0) + status.slice(1).toLowerCase(),
            "Annual Leave": statusRequests.filter(r => r.type === "ANNUAL_LEAVE").length,
            "Block Leave": statusRequests.filter(r => r.type === "BLOCK_LEAVE").length,
            "Sick Leave": statusRequests.filter(r => r.type === "SICK_LEAVE").length,
          };
        });

        setData(statusData);
      } catch (error) {
        console.error("Failed to load leave type data:", error);
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
          Leave Types by Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {data.every(d => d["Annual Leave"] === 0 && d["Block Leave"] === 0 && d["Sick Leave"] === 0) ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            No leave data in this range.
          </div>
        ) : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(8px)',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                />
                <Bar dataKey="Annual Leave" fill={TYPE_COLORS["Annual Leave"]} radius={[8, 8, 0, 0]} barSize={20} />
                <Bar dataKey="Block Leave" fill={TYPE_COLORS["Block Leave"]} radius={[8, 8, 0, 0]} barSize={20} />
                <Bar dataKey="Sick Leave" fill={TYPE_COLORS["Sick Leave"]} radius={[8, 8, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
