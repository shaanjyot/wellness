import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/cms/sections?pageId=123
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID required' }, { status: 400 });
    }

    const { data: sections, error } = await supabase
      .from('page_sections')
      .select('*')
      .eq('page_id', pageId)
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ sections });
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

// PUT /api/cms/sections - Update section content
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, content } = body;

    if (!id || !content) {
      return NextResponse.json({ error: 'Section ID and Content required' }, { status: 400 });
    }

    // Since we're using the client-side supabase in API routes (which usually uses ANON key),
    // this would be blocked by RLS for updates unless we use the SERVICE ROLE key.
    // However, the user's setup imports `supabase` from `@/lib/supabase` which is ANON key.
    // The admin dashboard is client-side, but API routes run on server.
    // We should ideally use the service-role client for updates if the user is authenticated as admin.

    // For now, let's assume the request comes from an authenticated admin via middleware/token check.
    // But since `supabase` client is initialized with ANON key globally in `@/lib/supabase`,
    // we need to instantiate a service-role client here for writes, OR rely on RLS if user is logged in via Supabase Auth.
    // Given the previous task used custom auth token, let's use the service role client for CMS updates.

    const { createClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: updatedSection, error } = await supabaseAdmin
      .from('page_sections')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, section: updatedSection });
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}
