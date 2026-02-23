import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
      throw error;
    }

    return NextResponse.json({ settings: data || { header_scripts: '', footer_scripts: '', google_ads_client: '' } });
  } catch (error) {
    console.error('Error fetching settings:', error);
    // If table doesn't exist, we'll just return empty settings
    return NextResponse.json({ settings: { header_scripts: '', footer_scripts: '', google_ads_client: '' } });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { header_scripts, footer_scripts, google_ads_client } = body;

    // Try to get existing record
    const { data: existing } = await supabaseAdmin
      .from('site_settings')
      .select('id')
      .limit(1)
      .single();

    let result;
    if (existing) {
      result = await supabaseAdmin
        .from('site_settings')
        .update({ header_scripts, footer_scripts, google_ads_client, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      result = await supabaseAdmin
        .from('site_settings')
        .insert([{ header_scripts, footer_scripts, google_ads_client }]);
    }

    if (result.error) throw result.error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
