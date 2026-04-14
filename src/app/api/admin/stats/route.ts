import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Acces refuse' }, { status: 403 });
  }

  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: totalOrders },
    { count: totalCustomers },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('orders').select('total_amount').eq('status', 'delivered'),
  ]);

  const revenue = revenueData?.reduce((sum: number, o: { total_amount: number }) => sum + o.total_amount, 0) || 0;

  // Low stock products
  const { data: lowStock } = await supabase
    .from('products')
    .select('id, name, stock_quantity')
    .lt('stock_quantity', 5)
    .eq('is_active', true)
    .order('stock_quantity');

  // Recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, total_amount, status, created_at, user_id')
    .order('created_at', { ascending: false })
    .limit(10);

  return NextResponse.json({
    stats: {
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
      totalOrders: totalOrders || 0,
      totalCustomers: totalCustomers || 0,
      revenue,
    },
    lowStock: lowStock || [],
    recentOrders: recentOrders || [],
  });
}
