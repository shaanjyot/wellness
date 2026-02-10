--
-- CMS Schema: Pages and Content
--

CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE, -- e.g. 'home', 'services', 'about'
    title TEXT NOT NULL,
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for pages
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to pages
CREATE POLICY "Public read access to pages" ON pages
    FOR SELECT
    TO public
    USING (true);

-- Allow admin full access
CREATE POLICY "Admin full access to pages" ON pages
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);


CREATE TABLE IF NOT EXISTS page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    section_key TEXT NOT NULL, -- e.g., 'hero', 'services_grid', 'about_content'
    title TEXT, -- Optional section title
    content JSONB NOT NULL DEFAULT '{}'::jsonb, -- Flexible content structure
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(page_id, section_key)
);

-- Enable RLS for page_sections
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access to page_sections" ON page_sections
    FOR SELECT
    TO public
    USING (true);

-- Allow admin full access
CREATE POLICY "Admin full access to page_sections" ON page_sections
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Trigger for update timestamp
CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON pages
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_page_sections_updated_at
    BEFORE UPDATE ON page_sections
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
