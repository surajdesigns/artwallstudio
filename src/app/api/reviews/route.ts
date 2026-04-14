import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('product_id');

  if (!productId) {
    return NextResponse.json({ error: 'product_id requis' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('*, profile:profiles(full_name, avatar_url)')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const avgRating = data && data.length > 0
    ? data.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / data.length
    : 0;

  return NextResponse.json({ reviews: data || [], avgRating, count: data?.length || 0 });
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Connexion requise' }, { status: 401 });
  }

  try {
    const { productId, rating, title, body } = await req.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Donnees invalides' }, { status: 400 });
    }

    // Check if already reviewed
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', session.user.id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Vous avez deja laisse un avis' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        product_id: productId,
        user_id: session.user.id,
        rating,
        title: title || null,
        body: body || null,
        is_approved: false, // requires admin approval
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ review: data, message: 'Avis soumis, en attente de validation' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
