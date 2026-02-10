'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, AlertCircle } from 'lucide-react';

interface Page {
  id: string;
  slug: string;
  title: string;
}

interface Section {
  id: string;
  section_key: string;
  title: string;
  content: any;
}

export default function CMSEditor() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch pages on load
  useEffect(() => {
    fetch('/api/cms/pages')
      .then(res => res.json())
      .then(data => {
        setPages(data.pages);
        setLoading(false);
      })
      .catch(err => console.error('Error fetching pages:', err));
  }, []);

  // Fetch sections when a page is selected
  useEffect(() => {
    if (selectedPage) {
      setLoading(true);
      fetch(`/api/cms/sections?pageId=${selectedPage.id}`)
        .then(res => res.json())
        .then(data => {
          setSections(data.sections);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching sections:', err);
          setLoading(false);
        });
    }
  }, [selectedPage]);

  const handleContentChange = (sectionId: string, newContentString: string) => {
    // Just update the local state for editing
    setSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        return { ...s, content: newContentString }; // Temporarily store as string for textarea
      }
      return s;
    }));
  };

  const handleSave = async (section: Section) => {
    setSaving(true);
    setJsonError(null);

    try {
      // Parse content if it's a string (from textarea)
      let parsedContent = section.content;
      if (typeof section.content === 'string') {
        parsedContent = JSON.parse(section.content);
      }

      const response = await fetch('/api/cms/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: section.id,
          content: parsedContent
        })
      });

      if (!response.ok) throw new Error('Failed to save');

      // Refresh data
      const data = await response.json();
      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: data.section.content } : s));
      alert('Section updated successfully!');
    } catch (e: any) {
      console.error('Save error:', e);
      setJsonError(e.message === 'Unexpected token' ? 'Invalid JSON format' : 'Error saving content');
      alert('Failed to save content. Check JSON format.');
    } finally {
      setSaving(false);
    }
  };

  if (!pages) return <div className="p-8">Loading CMS...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <button
            onClick={() => router.push('/secure-access/admin')}
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar: Page List */}
          <div className="bg-white rounded-xl shadow-sm p-4 h-fit">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Pages</h2>
            <nav className="space-y-2">
              {pages.map(page => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedPage?.id === page.id
                      ? 'bg-teal-50 text-teal-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {page.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Area: Section Editor */}
          <div className="md:col-span-3">
            {selectedPage ? (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedPage.title}</h2>
                  <p className="text-gray-500 text-sm">Update content sections for this page.</p>
                </div>

                {loading ? (
                  <div className="text-center py-12">Loading sections...</div>
                ) : (
                  sections.map((section) => (
                    <div key={section.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <span className="font-semibold text-gray-700 uppercase text-sm tracking-wider">
                          {section.section_key}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSave(section)}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                          >
                            <Save size={16} />
                            {saving ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Content JSON
                        </label>
                        <textarea
                          rows={12}
                          className="w-full font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          value={typeof section.content === 'string'
                            ? section.content
                            : JSON.stringify(section.content, null, 2)}
                          onChange={(e) => handleContentChange(section.id, e.target.value)}
                        />
                        {jsonError && (
                          <div className="mt-2 text-red-500 text-sm flex items-center gap-2">
                            <AlertCircle size={16} />
                            {jsonError}
                          </div>
                        )}
                        <p className="mt-2 text-xs text-gray-400">
                          Edit the JSON structure carefully. Changing keys may break the frontend display.
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
                Select a page from the sidebar to edit its content.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
