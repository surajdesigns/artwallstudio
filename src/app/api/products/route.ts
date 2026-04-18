import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { searchParams } = new URL(req.url);

  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort') || 'newest';
  const featured = searchParams.get('featured') === 'true';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '24');
  const offset = (page - 1) * limit;

  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `, { count: 'exact' })
    .eq('is_active', true);

  if (q) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }

  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();
    if (cat) query = query.eq('category_id', cat.id);
  }

  if (minPrice) query = query.gte('price', parseFloat(minPrice));
  if (maxPrice) query = query.lte('price', parseFloat(maxPrice));
  if (featured) query = query.eq('is_featured', true);

  switch (sort) {
    case 'price-asc': query = query.order('price', { ascending: true }); break;
    case 'price-desc': query = query.order('price', { ascending: false }); break;
    case 'newest':
    default: query = query.order('created_at', { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data: products, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    products: products || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  });
}
