import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/cms/pages - List all pages
export async function GET(request: NextRequest) {
  try {
    const { data: pages, error } = await supabase
      .from('pages')
      .select('*')
      .order('title', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error fetching CMS pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}
