"use client";

import { CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

interface DashboardStatsCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  variant: "blue" | "amber" | "green" | "red";
}

const variantStyles: Record<string, { bg: string; icon: string }> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    icon: "text-blue-600 dark:text-blue-400",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    icon: "text-amber-600 dark:text-amber-400",
  },
  green: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950/40",
    icon: "text-red-600 dark:text-red-400",
  },
};

export function DashboardStatsCard({
  title,
  count,
  icon: Icon,
  variant,
}: DashboardStatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl border border-white/40 dark:border-slate-700/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-xl">
      <CardContent className="flex items-center gap-4 p-6">
        <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner border border-white/50 dark:border-slate-600/50", styles.bg)}>
          <Icon className={cn("h-7 w-7", styles.icon)} />
        </div>
        <div className="space-y-1">
          <p className="text-label text-muted-foreground">{title}</p>
          <AnimatedCounter
            value={count}
            className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 tabular-nums"
          />
        </div>
      </CardContent>
    </div>
  );
}
