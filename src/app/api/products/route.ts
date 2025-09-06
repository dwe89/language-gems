import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('🔍 [API] Creating server-side Supabase client...');
    
    // Create a server-side Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    console.log('🔍 [API] Fetching products from server...');
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    console.log('🔍 [API] Server response:', { data: data?.length, error });

    if (error) {
      console.error('❌ [API] Error fetching products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('✅ [API] Successfully fetched', data?.length || 0, 'products');
    return NextResponse.json({ products: data || [] });
    
  } catch (error) {
    console.error('❌ [API] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
