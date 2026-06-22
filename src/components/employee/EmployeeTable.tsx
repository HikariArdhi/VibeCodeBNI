"use client";

import { Employee } from "@/types";
import { Edit2, Trash2, Building2, Briefcase, CalendarClock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { StaggerContainer, StaggerItem } from "@/components/shared/StaggerContainer";

interface EmployeeGridProps {
  employees: Employee[];
  onDelete: (id: string) => void;
}

// Function to generate a stable, beautiful gradient based on the department string
const getDepartmentGradient = (department: string) => {
  const gradients = [
    "from-violet-400 to-indigo-500",
    "from-emerald-400 to-teal-500",
    "from-amber-400 to-orange-500",
    "from-sky-400 to-blue-500",
    "from-fuchsia-400 to-pink-500",
    "from-rose-400 to-red-500"
  ];
  
  let hash = 0;
  for (let i = 0; i < department.length; i++) {
    hash = department.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

export function EmployeeTable({ employees, onDelete }: EmployeeGridProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <>
      <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {employees.map((employee) => (
          <StaggerItem key={employee.id}>
            <div
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl border border-white/60 dark:border-slate-700/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
            >
              {/* Top Color Banner */}
              <div className={cn("h-24 w-full bg-gradient-to-br opacity-80", getDepartmentGradient(employee.department))} />
              
              <div className="px-6 pb-6 pt-0 flex flex-col flex-1 relative">
                {/* Floating Avatar */}
                <div className="relative -mt-12 mb-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-700 shadow-sm text-3xl font-bold tracking-tight text-slate-700 dark:text-slate-200">
                    {getInitials(employee.name)}
                  </div>
                </div>

                {/* Data Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-headline text-slate-800 dark:text-slate-100 line-clamp-1">{employee.name}</h3>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/80 dark:bg-slate-700/80 text-primary">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{employee.position}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/80 dark:bg-slate-700/80 text-primary">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span className="font-medium bg-slate-100/80 dark:bg-slate-700/80 px-2.5 py-1 rounded-full text-xs text-slate-700 dark:text-slate-300">
                        {employee.department}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mt-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/80 dark:bg-slate-700/80 text-primary">
                        <CalendarClock className="h-4 w-4" />
                      </div>
                      <span className="font-medium">
                        Leave Bal: {employee.annualLeaveBalance} days
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <div className={"flex h-8 w-8 items-center justify-center rounded-full text-white " + (employee.blockLeaveTaken ? "bg-emerald-500" : "bg-amber-500")}>
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <span className="font-medium">
                        Block Leave: {employee.blockLeaveTaken ? "Compliant" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                  <Link
                    href={`/employees/edit/${employee.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-100/80 dark:bg-slate-700/80 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-primary hover:text-white"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteId(employee.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors hover:bg-red-500 hover:text-white dark:hover:bg-red-600"
                    title="Delete Personnel"
                    aria-label={`Delete ${employee.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Personnel"
        description="Are you sure you want to delete this personnel record? All associated leave requests will also be permanently deleted."
        onConfirm={() => {
          if (deleteId) {
            onDelete(deleteId);
            setDeleteId(null);
          }
        }}
        variant="destructive"
        confirmText="Delete Personnel"
      />
    </>
  );
}
