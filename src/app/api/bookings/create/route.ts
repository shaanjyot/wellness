import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendBookingStatusEmail } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, service, date, time, message } = await request.json();

    if (!name || !email || !phone || !service || !date || !time) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
    }

    // Use service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // Send confirmation email
    try {
      await sendBookingStatusEmail({
        customerName: name,
        customerEmail: email,
        service,
        date,
        time,
        status: 'pending',
        phone,
      });
      console.log(`Booking confirmation email sent to ${email}`);
    } catch (emailError) {
      // Log email error but don't fail the booking
      console.error('Failed to send confirmation email:', emailError);
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
