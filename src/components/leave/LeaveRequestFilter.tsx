"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LeaveStatus } from "@/types";

type StatusFilter = LeaveStatus | "ALL";

interface LeaveRequestFilterProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}

const filterOptions: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export function LeaveRequestFilter({
  value,
  onChange,
}: LeaveRequestFilterProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as StatusFilter)}>
      <TabsList>
        {filterOptions.map((option) => (
          <TabsTrigger key={option.value} value={option.value}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
