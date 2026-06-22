"use client";

import { useEffect, useState } from "react";
import { LeaveStorageService } from "@/services/leave-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { type DateRange, getDateFromRange } from "@/components/shared/DateRangeFilter";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface LeavesTrendChartProps {
  dateRange?: DateRange;
}

export function LeavesTrendChart({ dateRange = "1Y" }: LeavesTrendChartProps) {
  const [data, setData] = useState<{ month: string; requests: number; approved: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allRequests = await LeaveStorageService.getAll();
        const rangeStart = getDateFromRange(dateRange);

        const filtered = allRequests.filter(r => new Date(r.startDate) >= rangeStart);

        // Group by month
        const monthlyData = MONTHS.map((month, index) => {
          const monthRequests = filtered.filter(r => {
            const date = new Date(r.startDate);
            return date.getMonth() === index;
          });
          const approvedInMonth = monthRequests.filter(r => r.status === "APPROVED").length;

          return {
            month,
            requests: monthRequests.length,
            approved: approvedInMonth,
          };
        }).filter(d => d.requests > 0 || d.approved > 0);

        setData(monthlyData.length > 0 ? monthlyData : MONTHS.map(m => ({ month: m, requests: 0, approved: 0 })));
      } catch (error) {
        console.error("Failed to load leave trend data:", error);
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
          Leave Requests Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {data.every(d => d.requests === 0) ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            No leave data in this range.
          </div>
        ) : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
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
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  fill="url(#colorRequests)"
                  name="Total Requests"
                />
                <Area
                  type="monotone"
                  dataKey="approved"
                  stroke="#34d399"
                  strokeWidth={2.5}
                  fill="url(#colorApproved)"
                  name="Approved"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
