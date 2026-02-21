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

// POST /api/cms/pages - Create a new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, meta_description } = body;

    const { data, error } = await supabase
      .from('pages')
      .insert({
        title,
        slug,
        meta_description
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ page: data }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: error.message || 'Failed to create page' }, { status: 500 });
  }
}
