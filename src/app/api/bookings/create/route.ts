import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, service, date, time, message } = await request.json();

    if (!name || !email || !phone || !service || !date || !time) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO bookings (name, email, phone, service, date, time, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, email, phone, service, date, time, message || '');

    return NextResponse.json({
      success: true,
      bookingId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
