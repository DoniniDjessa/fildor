import DashboardPageClient from '@/components/dashboard/DashboardPageClient';
import { getOrders } from '@/lib/actions/orders.actions';
import { getDashboardStats } from '@/lib/actions/dashboard.actions';

export default async function DashboardPage() {
  // Load data server-side
  const [orders, dashboardStats] = await Promise.all([
    getOrders(),
    getDashboardStats('month'),
  ]);

  return (
    <DashboardPageClient
      initialOrders={orders}
      initialStats={dashboardStats}
    />
  );
}
