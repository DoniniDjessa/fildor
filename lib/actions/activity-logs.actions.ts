'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ActivityLog {
  id: string;
  order_id?: string | null;
  stock_item_id?: string | null;
  employee_id?: string | null;
  material_name: string;
  quantity: number;
  unit: string;
  motif?: string | null;
  stock_change: number;
  created_at: string;
  // Joined data
  order?: {
    id: string;
    client?: {
      noms?: string;
      surnom?: string;
    };
  };
  employee?: {
    id: string;
    name?: string;
    email?: string;
  };
}

export interface CreateActivityLogData {
  order_id?: string;
  stock_item_id: string;
  material_name: string;
  quantity: number;
  unit: string;
  motif?: string;
  stock_change: number; // Should be negative for deduction
  couturier_id?: string; // Optional: if admin selects a couturier
}

export async function createActivityLog(data: CreateActivityLogData) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: log, error } = await supabase
    .from('ct-activity-logs')
    .insert({
      order_id: data.order_id || null,
      stock_item_id: data.stock_item_id,
      employee_id: user?.id || null,
      material_name: data.material_name,
      quantity: data.quantity,
      unit: data.unit,
      motif: data.motif || null,
      stock_change: data.stock_change,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/couture');
  return log as ActivityLog;
}

export async function getActivityLogs(limit: number = 50) {
  const supabase = await createServerClient();

  // Fetch logs without relations first
  const { data: logsData, error: logsError } = await supabase
    .from('ct-activity-logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (logsError) {
    throw new Error(logsError.message);
  }

  if (!logsData || logsData.length === 0) {
    return [];
  }

  // Get unique IDs for relations
  const orderIds = [...new Set(logsData.map((l: any) => l.order_id).filter(Boolean))];
  const employeeIds = [...new Set(logsData.map((l: any) => l.employee_id).filter(Boolean))];

  // Fetch orders with clients separately
  let ordersMap = new Map();
  if (orderIds.length > 0) {
    const { data: ordersData } = await supabase
      .from('ct-orders')
      .select('id, client_id')
      .in('id', orderIds);

    if (ordersData && ordersData.length > 0) {
      const clientIds = [...new Set(ordersData.map((o: any) => o.client_id).filter(Boolean))];
      
      if (clientIds.length > 0) {
        const { data: clientsData } = await supabase
          .from('ct-clients')
          .select('id, noms, surnom')
          .in('id', clientIds);

        const clientsMap = new Map(
          (clientsData || []).map((c: any) => [c.id, c])
        );

        ordersMap = new Map(
          ordersData.map((o: any) => [
            o.id,
            {
              id: o.id,
              client: o.client_id ? clientsMap.get(o.client_id) || null : null,
            },
          ])
        );
      } else {
        ordersMap = new Map(
          ordersData.map((o: any) => [o.id, { id: o.id, client: null }])
        );
      }
    }
  }

  // Fetch employees from ct-users
  // Note: employee_id in ct-activity-logs references auth.users(id)
  // and ct-users also references auth.users(id), so we can match by id
  let employeesMap = new Map();
  if (employeeIds.length > 0) {
    const { data: employeesData, error: employeesError } = await supabase
      .from('ct-users')
      .select('id, name, email')
      .in('id', employeeIds);

    if (employeesError) {
      console.error('Error fetching employees:', employeesError);
    } else if (employeesData) {
      employeesMap = new Map(
        employeesData.map((e: any) => [
          e.id,
          {
            id: e.id,
            name: e.name,
            email: e.email,
          },
        ])
      );
    }
  }

  // Combine logs with relations
  const enrichedLogs = logsData.map((log: any) => ({
    ...log,
    order: log.order_id ? ordersMap.get(log.order_id) || null : null,
    employee: log.employee_id ? employeesMap.get(log.employee_id) || null : null,
  }));

  return enrichedLogs as ActivityLog[];
}

