import type { Notification } from "@/types";
import { supabase } from "@/lib/supabase";

function mapRowToNotification(row: Record<string, unknown>): Notification {
  return {
    id: row.id as string,
    title: row.title as string,
    message: row.message as string,
    type: row.type as Notification["type"],
    createdBy: row.created_by as string,
    isRead: row.is_read as boolean,
    createdAt: row.created_at as string,
  };
}

export class NotificationService {
  static async getAll(): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Failed to fetch notifications:", error);
        return [];
      }
      return (data || []).map(mapRowToNotification);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return [];
    }
  }

  static async getUnread(): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("is_read", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch unread notifications:", error);
        return [];
      }
      return (data || []).map(mapRowToNotification);
    } catch (error) {
      console.error("Failed to fetch unread notifications:", error);
      return [];
    }
  }

  static async create(data: {
    title: string;
    message: string;
    type: Notification["type"];
    createdBy: string;
  }): Promise<Notification> {
    const row = {
      title: data.title,
      message: data.message,
      type: data.type,
      created_by: data.createdBy,
    };

    const { data: inserted, error } = await supabase
      .from("notifications")
      .insert(row)
      .select()
      .single();

    if (error || !inserted) {
      throw new Error(`Failed to create notification: ${error?.message || "Unknown error"}`);
    }

    return mapRowToNotification(inserted);
  }

  static async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }

  static async markAllAsRead(): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);

    if (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete notification:", error);
    }
  }
}
