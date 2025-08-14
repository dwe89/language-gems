import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('sentences')
      .select('subcategory')
      .not('subcategory', 'is', null);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch subcategories' }, { status: 500 });
    }

    // Extract unique subcategories
    const subcategories = [...new Set(data.map(item => item.subcategory))].filter(Boolean).sort();

    return NextResponse.json({ subcategories });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
