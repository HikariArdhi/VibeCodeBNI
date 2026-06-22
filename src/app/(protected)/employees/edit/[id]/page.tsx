"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmployeeForm } from "@/components/employee/EmployeeForm";
import { EmployeeStorageService } from "@/services/employee-storage";
import type { Employee } from "@/types";
import type { EmployeeFormValues } from "@/validators/employee-validator";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  const id = params.id as string;

  useEffect(() => {
    const loadEmployee = async () => {
      const found = await EmployeeStorageService.getById(id);
      if (!found) {
        toast.error("Employee not found.");
        router.push("/employees");
        return;
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmployee(found);
      setLoading(false);
    };
    loadEmployee();
  }, [id, router]);

  const handleSubmit = async (data: EmployeeFormValues) => {
    await EmployeeStorageService.update(id, data);
    toast.success("Employee updated successfully.");
    router.push("/employees");
  };

  if (loading || !employee) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Employee"
        description={`Editing ${employee.name}'s record.`}
      />
      <EmployeeForm
        mode="edit"
        defaultValues={{
          name: employee.name,
          department: employee.department,
          position: employee.position,
          annualLeaveBalance: employee.annualLeaveBalance,
          blockLeaveTaken: employee.blockLeaveTaken,
          dateOfBirth: employee.dateOfBirth || "",
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
