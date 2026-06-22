"use client";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { Employee, LeaveRequest } from "@/types";
import { formatDate, calculateLeaveDays } from "@/lib/utils";

export function exportEmployeesToExcel(employees: Employee[]) {
  const data = employees.map((e) => ({
    "Nama": e.name,
    "Department": e.department,
    "Position": e.position,
    "Sisa Cuti (Hari)": e.annualLeaveBalance,
    "Block Leave": e.blockLeaveTaken ? "Sudah" : "Belum",
  }));

  const ws = XLSX.utils.json_to_sheet(data);

  // Auto-width columns
  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.max(key.length, ...data.map((row) => String(row[key as keyof typeof row]).length)) + 2,
  }));
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Employees");

  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buf], { type: "application/octet-stream" });
  saveAs(blob, `employees_${new Date().toISOString().split("T")[0]}.xlsx`);
}

export function exportLeaveRequestsToExcel(
  requests: LeaveRequest[],
  employeeMap: Record<string, string>
) {
  const typeLabels: Record<string, string> = {
    ANNUAL_LEAVE: "Cuti Tahunan",
    BLOCK_LEAVE: "Block Leave",
    SICK_LEAVE: "Sakit",
  };

  const statusLabels: Record<string, string> = {
    PENDING: "Menunggu",
    APPROVED: "Disetujui",
    REJECTED: "Ditolak",
  };

  const data = requests.map((r) => ({
    "Nama Karyawan": employeeMap[r.employeeId] || "Unknown",
    "Jenis Cuti": typeLabels[r.type] || r.type,
    "Tanggal Mulai": formatDate(r.startDate),
    "Tanggal Selesai": formatDate(r.endDate),
    "Durasi (Hari)": calculateLeaveDays(r.startDate, r.endDate),
    "Alasan": r.reason,
    "Status": statusLabels[r.status] || r.status,
  }));

  const ws = XLSX.utils.json_to_sheet(data);

  // Auto-width columns
  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.max(key.length, ...data.map((row) => String(row[key as keyof typeof row]).length)) + 2,
  }));
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leave Requests");

  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buf], { type: "application/octet-stream" });
  saveAs(blob, `leave_requests_${new Date().toISOString().split("T")[0]}.xlsx`);
}
