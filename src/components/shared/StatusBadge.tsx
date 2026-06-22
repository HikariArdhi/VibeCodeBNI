import { Badge } from "@/components/ui/badge";
import type { LeaveStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: LeaveStatus;
}

const statusConfig: Record<
  LeaveStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-amber-100/80 text-amber-700 border-amber-200/50 shadow-sm dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/50",
  },
  APPROVED: {
    label: "Approved",
    className:
      "bg-emerald-100/80 text-emerald-700 border-emerald-200/50 shadow-sm dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/50",
  },
  REJECTED: {
    label: "Rejected",
    className:
      "bg-red-100/80 text-red-700 border-red-200/50 shadow-sm dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("font-mono text-[10px] tracking-wider uppercase font-medium rounded-full px-3 py-1", config.className)}>
      {config.label}
    </Badge>
  );
}
