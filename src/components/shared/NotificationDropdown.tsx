"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, X, Check, CheckCheck, Megaphone, Cake, Cpu, Loader2 } from "lucide-react";
import { NotificationService } from "@/services/notification-service";
import type { Notification } from "@/types";
import { cn } from "@/lib/utils";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

const typeIcons = {
  ANNOUNCEMENT: Megaphone,
  BIRTHDAY: Cake,
  SYSTEM: Cpu,
};

const typeColors = {
  ANNOUNCEMENT: "text-blue-500 bg-blue-50 dark:bg-blue-950/40",
  BIRTHDAY: "text-pink-500 bg-pink-50 dark:bg-pink-950/40",
  SYSTEM: "text-slate-500 bg-slate-50 dark:bg-slate-800/40",
};

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const all = await NotificationService.getAll();
      setNotifications(all);
      setUnreadCount(all.filter(n => !n.isRead).length);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    // Poll every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await NotificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await NotificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleDelete = async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    await NotificationService.delete(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notif && !notif.isRead) setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) loadNotifications(); }}
        aria-label="Notifications"
        className="relative text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold font-mono text-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 z-50 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-title text-sm text-slate-800 dark:text-slate-100">Notifikasi</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                <Bell className="h-8 w-8 text-slate-200 dark:text-slate-700 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada notifikasi</p>
              </div>
            ) : (
              notifications.slice(0, 20).map((notif) => {
                const Icon = typeIcons[notif.type];
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 border-b border-slate-50 dark:border-slate-800/50 transition-colors",
                      !notif.isRead && "bg-blue-50/50 dark:bg-blue-950/20"
                    )}
                  >
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl mt-0.5", typeColors[notif.type])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm", !notif.isRead ? "font-semibold text-slate-800 dark:text-slate-100" : "text-slate-600 dark:text-slate-300")}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500 mt-1">{timeAgo(notif.createdAt)}</p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      {!notif.isRead && (
                        <button onClick={() => handleMarkAsRead(notif.id)} className="text-blue-500 hover:text-blue-700 p-1" title="Tandai dibaca">
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(notif.id)} className="text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 p-1" title="Hapus">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
