"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LeaveRequestForm } from "@/components/leave/LeaveRequestForm";
import { LeaveStorageService } from "@/services/leave-storage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { LeaveRequestFormValues } from "@/validators/leave-request-validator";

export default function NewLeaveRequestPage() {
  const router = useRouter();

  const handleSubmit = async (data: LeaveRequestFormValues) => {
    await LeaveStorageService.create(data);
    toast.success("Leave request submitted successfully.");
    router.push("/leave");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Leave Request"
        description="Submit a new leave request for an employee."
      />
      <LeaveRequestForm onSubmit={handleSubmit} />
    </div>
  );
}
