import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Building, Users, CreditCard, AlertTriangle } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewCard } from "./OverviewCard";

interface DashboardStats {
  totalOrganizations: number;
  activeOrganizations: number;
  blockedOrganizations: number;
  overdueOrganizations: number;
  totalRevenue: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrganizations: 0,
    activeOrganizations: 0,
    blockedOrganizations: 0,
    overdueOrganizations: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total organizations
        const { data: orgs, error: orgsError } = await supabase
          .from('organizations')
          .select('*', { count: 'exact' })
          .is('deleted_at', null)
          .eq('is_admin', false);

        if (orgsError) throw orgsError;

        // Filter for different statuses
        const active = orgs?.filter(org => org.subscription_status === 'active' && !org.blocked).length || 0;
        const blocked = orgs?.filter(org => org.blocked).length || 0;
        const overdue = orgs?.filter(org => 
          new Date(org.subscription_due_date) < new Date() && 
          org.subscription_status === 'active'
        ).length || 0;

        // Calculate total revenue
        const totalAmount = orgs?.reduce((sum, org) => sum + (org.subscription_amount || 0), 0) || 0;

        setStats({
          totalOrganizations: orgs?.length || 0,
          activeOrganizations: active,
          blockedOrganizations: blocked,
          overdueOrganizations: overdue,
          totalRevenue: totalAmount
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Carregando estatísticas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Empresas"
          value={stats.totalOrganizations}
          icon={Building}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Empresas Ativas"
          value={stats.activeOrganizations}
          icon={Users}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Empresas Bloqueadas"
          value={stats.blockedOrganizations}
          icon={AlertTriangle}
          iconColor="text-red-500"
        />
        <StatsCard
          title="Receita Mensal"
          value={`R$ ${stats.totalRevenue.toFixed(2)}`}
          icon={CreditCard}
          iconColor="text-purple-500"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visão Geral</CardTitle>
          <CardDescription>
            Estatísticas e informações sobre as empresas cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <OverviewCard
              title="Empresas com Pagamento Atrasado"
              value={stats.overdueOrganizations}
              icon={AlertTriangle}
              className="bg-amber-50"
              iconClassName="text-amber-500"
              textClassName="text-amber-700"
            />
            <OverviewCard
              title="Taxa de Conversão"
              value={`${stats.totalOrganizations > 0 
                ? Math.round((stats.activeOrganizations / stats.totalOrganizations) * 100) 
                : 0}%`}
              icon={CreditCard}
              className="bg-blue-50"
              iconClassName="text-blue-500"
              textClassName="text-blue-700"
            />
            <OverviewCard
              title="Empresas Ativas"
              value={stats.activeOrganizations}
              icon={Users}
              className="bg-green-50"
              iconClassName="text-green-500"
              textClassName="text-green-700"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
