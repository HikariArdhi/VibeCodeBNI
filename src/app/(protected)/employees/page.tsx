"use client";

import { useEmployees } from "@/hooks/useEmployees";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmployeeTable } from "@/components/employee/EmployeeTable";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Plus, Users, Loader2, ShieldAlert, Download } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AuthStorageService } from "@/services/auth-storage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { exportEmployeesToExcel } from "@/lib/export-excel";
import { toast } from "sonner";

export default function EmployeesPage() {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(true);
  const { employees, loading, searchQuery, setSearchQuery, deleteEmployee } =
    useEmployees();

  useEffect(() => {
    if (AuthStorageService.getRole() !== "MANAGER") {
      setHasAccess(false);
      router.replace("/dashboard");
    }
  }, [router]);

  const handleExport = () => {
    if (employees.length === 0) {
      toast.error("Tidak ada data untuk di-export.");
      return;
    }
    exportEmployeesToExcel(employees);
    toast.success("Data karyawan berhasil di-export ke Excel!");
  };

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <ShieldAlert className="h-12 w-12 text-red-500" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-slate-500">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Manage your employee records."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-full shadow-sm"
              onClick={handleExport}
              disabled={loading}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Link
              href="/employees/new"
              className={cn(buttonVariants({ variant: "default" }), "rounded-full shadow-md")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Link>
          </div>
        }
      />

      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search employees by name..."
      />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : employees.length === 0 ? (
        <EmptyState
          icon={Users}
          title={searchQuery ? "No results found" : "No employees yet"}
          description={
            searchQuery
              ? `No employees match "${searchQuery}". Try a different search term.`
              : "Get started by adding your first employee."
          }
          action={
            !searchQuery ? (
              <Link
                href="/employees/new"
                className={cn(buttonVariants({ variant: "default" }), "rounded-full shadow-md")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Link>
            ) : undefined
          }
        />
      ) : (
        <EmployeeTable employees={employees} onDelete={deleteEmployee} />
      )}
    </div>
  );
}
