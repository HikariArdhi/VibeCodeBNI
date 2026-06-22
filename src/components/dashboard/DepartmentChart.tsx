"use client";

import { useEffect, useState } from "react";
import { EmployeeStorageService } from "@/services/employee-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { DEPARTMENTS } from "@/constants";

export function DepartmentChart() {
  const [data, setData] = useState<{ name: string; employees: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const employees = await EmployeeStorageService.getAll();
        
        const chartData = DEPARTMENTS.map(dept => {
          return {
            name: dept,
            employees: employees.filter(e => e.department === dept).length
          };
        }).filter(item => item.employees > 0);

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(chartData.sort((a, b) => b.employees - a.employees));
      } catch (error) {
        console.error("Failed to load department chart data:", error);
      } finally {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex h-[350px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-300 dark:text-slate-600" />
      </Card>
    );
  }

  return (
    <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl border border-white/40 dark:border-slate-700/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-[350px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-title text-base text-slate-800 dark:text-slate-100">
          Employees by Department
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            No employees found.
          </div>
        ) : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorEmployees" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#c084fc" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} 
                  width={90}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(248, 250, 252, 0.5)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
                <Bar 
                  dataKey="employees" 
                  fill="url(#colorEmployees)" 
                  radius={[0, 16, 16, 0]} 
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
