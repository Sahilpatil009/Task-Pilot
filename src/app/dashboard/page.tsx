import Dashboard from "@/features/dashboard/components/Dashboard";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  await auth.protect();

  return <Dashboard />;
}
