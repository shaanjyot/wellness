import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/blogs/[id] - Fetch a single blog by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if id is a number (ID) or string (slug)
    const isNumeric = /^\d+$/.test(id);

    let query = supabase
      .from('blogs')
      .select('*')
      .single();

    if (isNumeric) {
      query = query.eq('id', parseInt(id));
    } else {
      query = query.eq('slug', id);
    }

    const { data: blog, error } = await query;

    if (error || !blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error('Error in GET /api/blogs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/blogs/[id] - Update a blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, excerpt, content, featured_image, category, tags, status, author } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Generate slug from title if title changed
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    const updateData = {
      title,
      slug,
      excerpt: excerpt || '',
      content,
      featured_image: featured_image || '',
      category: category || 'general',
      tags: tags || [],
      status: status || 'draft',
      author: author || 'Admin',
      updated_at: new Date().toISOString()
    };

    // If status changed to published, update published_at
    if (status === 'published') {
      updateData.published_at = new Date().toISOString();
    }

    const { data: blog, error } = await supabase
      .from('blogs')
      .update(updateData)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      console.error('Error updating blog:', error);
      return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error('Error in PUT /api/blogs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/blogs/[id] - Delete a blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('Error deleting blog:', error);
      return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/blogs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
