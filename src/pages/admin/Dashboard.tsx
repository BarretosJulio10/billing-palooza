
import { DashboardStats } from "./components/dashboard/DashboardStats";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
      </div>
      <DashboardStats />
    </div>
  );
}
