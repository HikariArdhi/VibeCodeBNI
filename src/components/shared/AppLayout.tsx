"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AuthStorageService } from "@/services/auth-storage";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  LogOut,
  CalendarCheck,
  Menu,
  User,
  Code2,
  Cake,
  Megaphone,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { NotificationDropdown } from "@/components/shared/NotificationDropdown";

const baseNavItems: { href: string; label: string; icon: typeof LayoutDashboard; managerOnly?: boolean }[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/leave", label: "Leave Requests", icon: CalendarDays },
  { href: "/birthdays", label: "Birthdays", icon: Cake },
  { href: "/broadcast", label: "Broadcast", icon: Megaphone, managerOnly: true },
  { href: "/code-review", label: "Code Review", icon: Code2 },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Calculate role-based items inside component
  const role = AuthStorageService.getRole();
  const navItems = baseNavItems.filter((item) => {
    if ((role === "EMPLOYEE" || role === "SUPERVISOR") && item.href === "/employees") return false;
    if (item.managerOnly && role !== "MANAGER") return false;
    return true;
  });

  const handleLogout = () => {
    AuthStorageService.logout();
    router.push("/login");
  };

  return (
    <div className="flex h-full flex-col bg-transparent">
      <div className="flex h-16 items-center gap-3 px-6 border-b border-white/40 dark:border-slate-700/60">
        <div className="flex h-8 w-8 items-center justify-center bg-primary rounded-xl text-white shadow-sm">
          <CalendarCheck className="h-5 w-5" />
        </div>
        <span className="text-title text-xl text-slate-800 dark:text-slate-100">Leave MS</span>
      </div>

      <nav className="flex-1 space-y-2 mt-6 px-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-[13px] font-semibold tracking-wide transition-all duration-300 rounded-2xl",
                isActive
                  ? "bg-white dark:bg-slate-800 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-primary"
                  : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-800"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/40 dark:border-slate-700/60">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl text-slate-500 dark:text-slate-400 transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 bg-white/40 dark:bg-slate-900/60 backdrop-blur-2xl border-r border-white/60 dark:border-slate-700/60 md:block z-10">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-white/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-900/60 backdrop-blur-2xl px-4 md:px-8 z-10">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger className="inline-flex h-10 w-10 items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl">
                  <Menu className="h-6 w-6" />
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 border-r border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/90 backdrop-blur-3xl">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SidebarContent onNavigate={() => setMobileOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="md:hidden flex items-center gap-2">
              <CalendarCheck className="h-6 w-6 text-primary" />
              <span className="text-title text-lg text-slate-800 dark:text-slate-100">Leave MS</span>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <ThemeToggle />
            <NotificationDropdown />
            <Separator orientation="vertical" className="h-6 bg-slate-200/50" />
            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-headline text-sm leading-none text-slate-800 dark:text-slate-100">
                  {AuthStorageService.getRole() === "MANAGER" ? "Admin User" : AuthStorageService.getRole() === "SUPERVISOR" ? "Supervisor" : "Employee"}
                </p>
                <p className="text-label text-slate-500 dark:text-slate-400 mt-1">
                  {AuthStorageService.getRole().toLowerCase()}
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center bg-white dark:bg-slate-800 shadow-sm text-primary rounded-xl border border-white/60 dark:border-slate-700/60">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
