import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { items, shippingAddress, shippingMethod, subtotal, shippingAmount, taxAmount } = body;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: session.user.id,
        subtotal,
        shipping_amount: shippingAmount,
        tax_amount: taxAmount,
        total_amount: subtotal + shippingAmount + taxAmount,
        shipping_address: shippingAddress,
        metadata: { shipping_method: shippingMethod },
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map((item: {
      productId: string;
      variantId?: string;
      name: string;
      image: string;
      price: number;
      quantity: number;
    }) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId || null,
      product_name: item.name,
      product_image: item.image,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Decrease stock
    for (const item of items) {
      await supabase.rpc('decrement_stock', {
        product_id: item.productId,
        quantity: item.quantity,
      });
    }

    return NextResponse.json({ order, success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
