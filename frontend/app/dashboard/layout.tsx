import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardLayoutShell } from "./components/dashboard-layout-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const hasAdminSession = Boolean(cookieStore.get("admin_session")?.value);

  if (!hasAdminSession) {
    redirect("/admin/login?next=/dashboard");
  }

  return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
}
