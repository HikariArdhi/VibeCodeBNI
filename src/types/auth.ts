export type Role = "MANAGER" | "SUPERVISOR" | "EMPLOYEE";

export type AuthSession = {
  username: string;
  role: Role;
  isAuthenticated: boolean;
  loginAt: string;
};
