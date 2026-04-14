import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ items: [] });

  const { data, error } = await supabase
    .from('wishlists')
    .select('product_id, product:products(*, images:product_images(*))')
    .eq('user_id', session.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data?.map((w: { product: unknown }) => w.product) || [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });

  const { productId } = await req.json();

  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('product_id', productId)
    .single();

  if (existing) {
    await supabase.from('wishlists').delete().eq('id', existing.id);
    return NextResponse.json({ wishlisted: false });
  } else {
    await supabase.from('wishlists').insert({ user_id: session.user.id, product_id: productId });
    return NextResponse.json({ wishlisted: true });
  }
}
