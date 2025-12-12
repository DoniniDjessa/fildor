import DashboardPageClient from '@/components/dashboard/DashboardPageClient';
import { getOrders } from '@/lib/actions/orders.actions';
import { getDashboardStats } from '@/lib/actions/dashboard.actions';
import { getClients } from '@/lib/actions/clients.actions';

export default async function DashboardPage() {
  // Load data server-side
  const [orders, dashboardStats, clients] = await Promise.all([
    getOrders(),
    getDashboardStats('month'),
    getClients(),
  ]);

  return (
    <DashboardPageClient
      initialOrders={orders}
      initialStats={dashboardStats}
      initialClients={clients}
    />
  );
}
