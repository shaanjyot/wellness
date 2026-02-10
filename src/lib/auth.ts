import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AdminPayload {
  id: string;
  username: string;
}

export function generateToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function authenticateAdmin(username: string, password: string) {
  try {
    console.log('🔐 Auth attempt:', username);

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single();

    console.log('📊 Supabase response:', { admin, error });

    if (error || !admin) {
      console.error('❌ Admin not found:', error?.message || 'No admin record');
      return { success: false, error: 'Invalid credentials' };
    }

    console.log('✅ Admin found:', admin.username);

    const isValidPassword = await comparePassword(password, admin.password);
    console.log('🔑 Password valid:', isValidPassword);

    if (!isValidPassword) {
      console.error('❌ Password mismatch');
      return { success: false, error: 'Invalid credentials' };
    }

    const token = generateToken({ id: admin.id, username: admin.username });
    console.log('🎫 Token generated:', token.substring(0, 20) + '...');

    return { success: true, token, admin: { id: admin.id, username: admin.username } };
  } catch (error) {
    console.error('❌ Authentication error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
