'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, AlertCircle, Plus, XCircle, Code } from 'lucide-react';
import JsonNode from '@/components/JsonCmsEditor';

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

  // Modals state
  const [showNewPage, setShowNewPage] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '', meta_description: '' });
  const [showNewSection, setShowNewSection] = useState(false);
  const [newSection, setNewSection] = useState({ section_key: '', title: '' });

  // View mode state for sections (visual vs json)
  // maps sectionId -> boolean
  const [visualMode, setVisualMode] = useState<Record<string, boolean>>({});

  const router = useRouter();

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cms/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPage)
      });
      if (!res.ok) throw new Error('Failed to create page');
      const data = await res.json();
      setPages([...pages, data.page].sort((a, b) => a.title.localeCompare(b.title)));
      setShowNewPage(false);
      setNewPage({ title: '', slug: '', meta_description: '' });
      setSelectedPage(data.page);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;
    try {
      const res = await fetch('/api/cms/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSection, page_id: selectedPage.id, content: {} })
      });
      if (!res.ok) throw new Error('Failed to create section');
      const data = await res.json();
      setSections([...sections, data.section]);
      setShowNewSection(false);
      setNewSection({ section_key: '', title: '' });
      setVisualMode(prev => ({ ...prev, [data.section.id]: true }));
    } catch (err: any) {
      alert(err.message);
    }
  };

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

  const handleContentChange = (sectionId: string, newContent: string | any, isJsonStr: boolean = true) => {
    setSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        return { ...s, content: newContent };
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Pages</h2>
              <button
                onClick={() => setShowNewPage(true)}
                className="p-1.5 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors"
                title="Add new page"
              >
                <Plus size={16} />
              </button>
            </div>
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
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedPage.title}</h2>
                    <p className="text-gray-500 text-sm">Update content sections for this page.</p>
                  </div>
                  <button
                    onClick={() => setShowNewSection(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-60 text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium"
                  >
                    <Plus size={16} />
                    Add Section
                  </button>
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
                            onClick={() => setVisualMode(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium border ${visualMode[section.id] ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}
                          >
                            <Code size={14} />
                            {visualMode[section.id] ? 'Switch to JSON' : 'Switch to Visual'}
                          </button>
                          <button
                            onClick={() => handleSave(section)}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                          >
                            <Save size={16} />
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Content JSON
                        </label>
                        {visualMode[section.id] ? (
                          <div className="mb-4">
                            <JsonNode
                              path={section.section_key}
                              propertyKey={section.section_key}
                              val={typeof section.content === 'string' ? JSON.parse(section.content || '{}') : section.content}
                              onChange={(newVal) => handleContentChange(section.id, newVal, false)}
                            />
                          </div>
                        ) : (
                          <>
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
                          </>
                        )}
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

      {showNewPage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Page</h2>
              <button onClick={() => setShowNewPage(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" value={newPage.title} onChange={e => setNewPage({ ...newPage, title: e.target.value })} className="w-full border p-2 rounded-lg" placeholder="e.g. Services" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input required type="text" value={newPage.slug} onChange={e => setNewPage({ ...newPage, slug: e.target.value })} className="w-full border p-2 rounded-lg" placeholder="e.g. services" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <input type="text" value={newPage.meta_description} onChange={e => setNewPage({ ...newPage, meta_description: e.target.value })} className="w-full border p-2 rounded-lg" />
              </div>
              <button type="submit" className="w-full bg-teal-600 text-white rounded-lg py-2 font-medium hover:bg-teal-700">Create Page</button>
            </form>
          </div>
        </div>
      )}

      {showNewSection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Section to {selectedPage?.title}</h2>
              <button onClick={() => setShowNewSection(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleCreateSection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Key</label>
                <input required type="text" value={newSection.section_key} onChange={e => setNewSection({ ...newSection, section_key: e.target.value })} className="w-full border p-2 rounded-lg" placeholder="e.g. hero" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
                <input type="text" value={newSection.title} onChange={e => setNewSection({ ...newSection, title: e.target.value })} className="w-full border p-2 rounded-lg" placeholder="e.g. Hero Section" />
              </div>
              <button type="submit" className="w-full bg-teal-600 text-white rounded-lg py-2 font-medium hover:bg-teal-700">Create Section</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
