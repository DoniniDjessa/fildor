'use server';

import { createServerClient } from '@/lib/supabase/server';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  ordersLastMonth: number;
  revenueLastMonth: number;
  pendingOrders: number;
  cuttingOrders: number;
  sewingOrders: number;
  fittingOrders: number;
  topClients: Array<{
    client_id: string;
    client_name: string;
    order_count: number;
    total_spent: number;
  }>;
}

export async function getDashboardStats(period: 'month' | 'quarter' | 'year' = 'month'): Promise<DashboardStats> {
  const supabase = await createServerClient();
  const now = new Date();
  
  // Calculate date range based on period
  let startDate: Date;
  if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === 'quarter') {
    const quarter = Math.floor(now.getMonth() / 3);
    startDate = new Date(now.getFullYear(), quarter * 3, 1);
  } else {
    startDate = new Date(now.getFullYear(), 0, 1);
  }

  // Get all orders
  const { data: allOrders, error: ordersError } = await supabase
    .from('ct-orders')
    .select('id, status, total_price, created_at, client_id');

  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    throw new Error(ordersError.message);
  }

  const orders = allOrders || [];

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0);

  // This month stats
  const ordersThisMonth = orders.filter((order) => {
    const orderDate = new Date(order.created_at);
    return orderDate >= startDate;
  }).length;

  const revenueThisMonth = orders
    .filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate >= startDate;
    })
    .reduce((sum, order) => sum + (order.total_price || 0), 0);

  // Last month stats (for comparison)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const ordersLastMonth = orders.filter((order) => {
    const orderDate = new Date(order.created_at);
    return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
  }).length;

  const revenueLastMonth = orders
    .filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
    })
    .reduce((sum, order) => sum + (order.total_price || 0), 0);

  // Orders by status
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const cuttingOrders = orders.filter((o) => o.status === 'cutting').length;
  const sewingOrders = orders.filter((o) => o.status === 'sewing').length;
  const fittingOrders = orders.filter((o) => o.status === 'fitting').length;

  // Top clients
  const clientStats = new Map<string, { client_id: string; order_count: number; total_spent: number }>();
  
  orders.forEach((order) => {
    if (!order.client_id) return;
    const existing = clientStats.get(order.client_id) || {
      client_id: order.client_id,
      order_count: 0,
      total_spent: 0,
    };
    existing.order_count++;
    existing.total_spent += order.total_price || 0;
    clientStats.set(order.client_id, existing);
  });

  // Get client names
  const clientIds = Array.from(clientStats.keys());
  let topClients: Array<{
    client_id: string;
    client_name: string;
    order_count: number;
    total_spent: number;
  }> = [];

  if (clientIds.length > 0) {
    const { data: clients } = await supabase
      .from('ct-clients')
      .select('id, noms, surnom')
      .in('id', clientIds);

    topClients = Array.from(clientStats.values())
      .map((stat) => {
        const client = clients?.find((c) => c.id === stat.client_id);
        return {
          ...stat,
          client_name: client?.noms || client?.surnom || 'Client inconnu',
        };
      })
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 5);
  }

  return {
    totalOrders,
    totalRevenue,
    ordersThisMonth,
    revenueThisMonth,
    ordersLastMonth,
    revenueLastMonth,
    pendingOrders,
    cuttingOrders,
    sewingOrders,
    fittingOrders,
    topClients,
  };
}

