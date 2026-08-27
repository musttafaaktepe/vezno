import { requireAdminSession } from "@/lib/session";
import AdminShell from "./_components/AdminShell";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();
  return (
    <AdminShell name={session.name || "Yönetici"} email={session.email}>
      {children}
    </AdminShell>
  );
}
