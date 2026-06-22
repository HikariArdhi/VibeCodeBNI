"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { EmployeeForm } from "@/components/employee/EmployeeForm";
import { EmployeeStorageService } from "@/services/employee-storage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { EmployeeFormValues } from "@/validators/employee-validator";

export default function NewEmployeePage() {
  const router = useRouter();

  const handleSubmit = async (data: EmployeeFormValues) => {
    await EmployeeStorageService.create(data);
    toast.success("Employee created successfully.");
    router.push("/employees");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Employee"
        description="Create a new employee record."
      />
      <EmployeeForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
}
