import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthStorageService } from "@/services/auth-storage";

type UseAuthReturn = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authenticated = AuthStorageService.isAuthenticated();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    const success = await AuthStorageService.login(username, password);

    if (success) {
      setIsAuthenticated(true);
    }

    return success;
  }, []);

  const logout = useCallback(() => {
    AuthStorageService.logout();
    setIsAuthenticated(false);
    router.push("/login");
  }, [router]);

  return { isAuthenticated, isLoading, login, logout };
}
