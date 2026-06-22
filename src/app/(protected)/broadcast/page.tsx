"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationService } from "@/services/notification-service";
import { AuthStorageService } from "@/services/auth-storage";
import { Send, Megaphone, Loader2, ShieldAlert, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BroadcastPage() {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(true);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (AuthStorageService.getRole() !== "MANAGER") {
      setHasAccess(false);
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Judul dan pesan harus diisi.");
      return;
    }

    setSending(true);
    try {
      const session = AuthStorageService.getSession();
      await NotificationService.create({
        title: title.trim(),
        message: message.trim(),
        type: "ANNOUNCEMENT",
        createdBy: session?.username || "admin",
      });

      toast.success("Notifikasi berhasil dikirim ke semua pengguna!");
      setSent(true);
      setTitle("");
      setMessage("");

      setTimeout(() => setSent(false), 3000);
    } catch (error) {
      console.error("Failed to send notification:", error);
      toast.error("Gagal mengirim notifikasi.");
    } finally {
      setSending(false);
    }
  };

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <ShieldAlert className="h-12 w-12 text-red-500" />
        <h2 className="text-2xl font-bold dark:text-white">Access Denied</h2>
        <p className="text-slate-500 dark:text-slate-400">Hanya Manager yang dapat mengirim broadcast.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="📢 Broadcast Notifikasi"
        description="Kirim pengumuman ke semua pengguna sistem."
      />

      <div className="max-w-2xl">
        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl border border-white/40 dark:border-slate-700/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-title text-slate-800 dark:text-slate-100">
              <Megaphone className="h-5 w-5 text-blue-500" />
              Kirim Pengumuman
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-headline text-slate-700 dark:text-slate-300">
                Judul Pengumuman
              </label>
              <Input
                placeholder="Contoh: Meeting Tahunan"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-headline text-slate-700 dark:text-slate-300">
                Isi Pesan
              </label>
              <textarea
                placeholder="Tulis pesan pengumuman di sini..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                maxLength={500}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 text-right">
                {message.length}/500
              </p>
            </div>

            <Button
              onClick={handleSend}
              disabled={sending || !title.trim() || !message.trim()}
              className="w-full rounded-xl shadow-md"
              size="lg"
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : sent ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Terkirim!
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Kirim ke Semua Pengguna
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="mt-6 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-5">
          <h4 className="text-sm font-bold text-title text-blue-800 dark:text-blue-300 mb-2">💡 Tips:</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1.5">
            <li>• Notifikasi akan muncul di 🔔 bell icon semua pengguna</li>
            <li>• Pengguna bisa menandai notifikasi sebagai sudah dibaca</li>
            <li>• Maksimum 50 notifikasi terbaru yang ditampilkan</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
