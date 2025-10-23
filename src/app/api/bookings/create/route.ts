import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, service, date, time, message } = await request.json();

    if (!name || !email || !phone || !service || !date || !time) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          name,
          email,
          phone,
          service,
          date,
          time,
          message: message || '',
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      bookingId: data.id
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
