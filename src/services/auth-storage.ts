import { STORAGE_KEYS } from "@/constants";
import type { AuthSession, Role } from "@/types";
import { supabase } from "@/lib/supabase";

export class AuthStorageService {
  static async login(username: string, password: string): Promise<boolean> {
    try {
      // Query the app_users table to verify credentials
      const { data, error } = await supabase
        .from("app_users")
        .select("*")
        .eq("username", username)
        .eq("password_hash", password)
        .single();

      if (error || !data) {
        return false;
      }

      const role = data.role as Role;

      const session: AuthSession = {
        username,
        role,
        isAuthenticated: true,
        loginAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
      return true;
    } catch {
      return false;
    }
  }

  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }

  static getSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (!raw) return null;

      const session: AuthSession = JSON.parse(raw);
      // fallback for older sessions without role
      if (!session.role) {
         session.role = "MANAGER";
      }
      return session;
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    const session = AuthStorageService.getSession();
    return session !== null && session.isAuthenticated;
  }

  static getRole(): Role {
    const session = AuthStorageService.getSession();
    return session?.role || "EMPLOYEE";
  }
}
