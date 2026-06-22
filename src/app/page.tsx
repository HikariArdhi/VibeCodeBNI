"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthStorageService } from "@/services/auth-storage";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (AuthStorageService.isAuthenticated()) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
