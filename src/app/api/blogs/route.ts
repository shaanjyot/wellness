import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  author: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

// Create a local supabase Admin instance to bypass RLS for admin operations
import { createClient } from '@supabase/supabase-js';
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

// GET /api/blogs - Fetch all blogs with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabaseAdmin
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { data: blogs, error } = await query;

    if (error) {
      console.error('Error fetching blogs:', error);
      return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('Error in GET /api/blogs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, featured_image, category, tags, status, author } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    const blogData = {
      title,
      slug,
      excerpt: excerpt || '',
      content,
      featured_image: featured_image || '',
      category: category || 'general',
      tags: tags || [],
      status: status || 'draft',
      author: author || 'Admin',
      published_at: status === 'published' ? new Date().toISOString() : null
    };

    const { data: blog, error } = await supabaseAdmin
      .from('blogs')
      .insert([blogData])
      .select()
      .single();

    if (error) {
      console.error('Error creating blog:', error);
      return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
    }

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/blogs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
