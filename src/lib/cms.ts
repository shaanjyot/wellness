import { supabase } from './supabase';

export interface PageSection {
  id: string;
  section_key: string;
  title: string;
  content: any;
  display_order: number;
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  meta_description: string;
  sections: Record<string, any>; // Keyed by section_key for easy access
}

/**
 * Fetch all content for a specific page by slug.
 * Returns a structured object where sections are keyed by their section_key.
 */
export async function getPageContent(slug: string): Promise<PageContent | null> {
  // 1. Fetch page metadata
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (pageError || !page) {
    console.error(`Error fetching page [${slug}]:`, pageError);
    return null;
  }

  // 2. Fetch all sections for this page
  const { data: sections, error: sectionsError } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', page.id)
    .order('display_order', { ascending: true });

  if (sectionsError) {
    console.error(`Error fetching sections for [${slug}]:`, sectionsError);
    return null;
  }

  // 3. Transform sections into a key-value map for easy frontend use
  const sectionsMap: Record<string, any> = {};
  sections.forEach((section: PageSection) => {
    sectionsMap[section.section_key] = section.content;
  });

  return {
    ...page,
    sections: sectionsMap
  };
}

/**
 * Update a specific section's content.
 * This is for the Admin CMS.
 */
export async function updateSectionContent(pageId: string, sectionKey: string, newContent: any) {
  const { data, error } = await supabase
    .from('page_sections')
    .update({ content: newContent, updated_at: new Date().toISOString() })
    .eq('page_id', pageId)
    .eq('section_key', sectionKey)
    .select();

  if (error) {
    throw error;
  }
  return data;
}
