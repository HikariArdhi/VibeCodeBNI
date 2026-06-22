"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  leaveRequestSchema,
  type LeaveRequestFormValues,
} from "@/validators/leave-request-validator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeStorageService } from "@/services/employee-storage";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Employee } from "@/types";

import { AuthStorageService } from "@/services/auth-storage";

interface LeaveRequestFormProps {
  onSubmit: (data: LeaveRequestFormValues) => void;
}

export function LeaveRequestForm({ onSubmit }: LeaveRequestFormProps) {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const role = AuthStorageService.getRole();

  const form = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      employeeId: "",
      type: "ANNUAL_LEAVE",
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const allEmployees = await EmployeeStorageService.getAll();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEmployees(allEmployees);

        if (role === "EMPLOYEE") {
          const haikal = allEmployees.find(e => e.name.toLowerCase().includes("haikal"));
          if (haikal) {
            form.setValue("employeeId", haikal.id);
          } else if (allEmployees.length > 0) {
            form.setValue("employeeId", allEmployees[0].id);
          }
        } else if (role === "SUPERVISOR") {
          const hikari = allEmployees.find(e => e.name.toLowerCase().includes("hikari"));
          if (hikari) {
            form.setValue("employeeId", hikari.id);
          }
        }
      } catch (error) {
        console.error("Failed to load employees:", error);
      }
    };
    loadEmployees();
  }, [role, form]);

  const handleSubmit = (data: LeaveRequestFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="max-w-lg space-y-6"
      >
        {role === "MANAGER" ? (
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an employee">
                        {field.value
                          ? employees.find((e) => e.id === field.value)?.name ??
                            "Select an employee"
                          : undefined}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} — {employee.department} (Sisa Cuti: {employee.annualLeaveBalance} hari)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee Selection</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select yourself">
                        {field.value
                          ? employees.find((e) => e.id === field.value)?.name ??
                            "Select yourself"
                          : undefined}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} (Sisa Cuti: {employee.annualLeaveBalance} hari)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  You are logged in as {employees.find(e => e.id === field.value)?.name || "Employee"}.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ANNUAL_LEAVE">Annual Leave (Cuti Tahunan)</SelectItem>
                  <SelectItem value="BLOCK_LEAVE">Block Leave (Cuti Wajib)</SelectItem>
                  <SelectItem value="SICK_LEAVE">Sick Leave (Cuti Sakit)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the reason for leave request"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting} className="rounded-xl shadow-sm">
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit Request
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/leave")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
