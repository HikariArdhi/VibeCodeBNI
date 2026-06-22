"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmployeeStorageService } from "@/services/employee-storage";
import type { Employee } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Cake, CalendarDays, Gift, PartyPopper, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function getAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function getDaysUntilBirthday(dob: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const birthDate = new Date(dob);
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  nextBirthday.setHours(0, 0, 0, 0);
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  const diff = nextBirthday.getTime() - today.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

function formatBirthday(dob: string): string {
  const date = new Date(dob);
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long" });
}

function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
}

const birthdayGradients = [
  "from-pink-400 to-rose-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-blue-500",
  "from-fuchsia-400 to-pink-500",
];

export default function BirthdayPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const all = await EmployeeStorageService.getAll();
        const withBirthday = all
          .filter(e => e.dateOfBirth)
          .sort((a, b) => getDaysUntilBirthday(a.dateOfBirth!) - getDaysUntilBirthday(b.dateOfBirth!));
        setEmployees(withBirthday);
      } catch (error) {
        console.error("Failed to load employees:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const todayBirthdays = employees.filter(e => getDaysUntilBirthday(e.dateOfBirth!) === 0);
  const upcomingBirthdays = employees.filter(e => {
    const days = getDaysUntilBirthday(e.dateOfBirth!);
    return days > 0 && days <= 30;
  });
  const laterBirthdays = employees.filter(e => getDaysUntilBirthday(e.dateOfBirth!) > 30);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="🎂 Employee Birthdays"
        description="See upcoming birthdays and celebrate together!"
      />

      {/* Today's Birthdays */}
      {todayBirthdays.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <PartyPopper className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold text-title text-slate-800 dark:text-slate-100">Hari Ini! 🎉</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {todayBirthdays.map((emp, i) => (
              <Card key={emp.id} className="overflow-hidden border-2 border-amber-300 dark:border-amber-600 shadow-lg shadow-amber-100/50 dark:shadow-amber-900/20">
                <div className={cn("h-20 bg-gradient-to-br", birthdayGradients[i % birthdayGradients.length])} />
                <CardContent className="pt-0 pb-6 px-6 relative">
                  <div className="relative -mt-10 mb-3">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-700 shadow-md text-2xl font-bold text-slate-700 dark:text-slate-200">
                      {getInitials(emp.name)}
                    </div>
                    <div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-white shadow-sm">
                      <Cake className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{emp.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{emp.department} · {emp.position}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Gift className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                      Ulang Tahun ke-{getAge(emp.dateOfBirth!) + 1} hari ini! 🥳
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming (within 30 days) */}
      {upcomingBirthdays.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-bold text-title text-slate-800 dark:text-slate-100">Segera (30 Hari Kedepan)</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingBirthdays.map((emp, i) => {
              const days = getDaysUntilBirthday(emp.dateOfBirth!);
              return (
                <Card key={emp.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl border border-white/40 dark:border-slate-700/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white font-bold text-lg shadow-sm", birthdayGradients[(i + 2) % birthdayGradients.length])}>
                      {getInitials(emp.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate">{emp.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{emp.department}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        🎂 {formatBirthday(emp.dateOfBirth!)} (umur {getAge(emp.dateOfBirth!) + 1})
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">{days}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">hari lagi</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Later */}
      {laterBirthdays.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Cake className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            <h2 className="text-lg font-bold text-title text-slate-800 dark:text-slate-100">Nanti</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {laterBirthdays.map((emp) => {
              const days = getDaysUntilBirthday(emp.dateOfBirth!);
              return (
                <Card key={emp.id} className="bg-white/40 dark:bg-slate-800/40 border border-white/40 dark:border-slate-700/40">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300">
                      {getInitials(emp.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{emp.name}</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {formatBirthday(emp.dateOfBirth!)} · {days} hari lagi
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {employees.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Cake className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Belum Ada Data Ulang Tahun</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tambahkan tanggal lahir karyawan di halaman edit employee.</p>
        </div>
      )}
    </div>
  );
}
