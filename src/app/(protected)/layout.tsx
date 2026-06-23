import { AuthGuard } from "@/components/shared/AuthGuard";
import { AppLayout } from "@/components/shared/AppLayout";

export const dynamic = "force-dynamic";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  );
}
