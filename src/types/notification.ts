export type Notification = {
  id: string;
  title: string;
  message: string;
  type: "ANNOUNCEMENT" | "BIRTHDAY" | "SYSTEM";
  createdBy: string;
  isRead: boolean;
  createdAt: string;
};
