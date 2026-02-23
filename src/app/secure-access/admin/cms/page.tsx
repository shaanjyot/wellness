'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Save, AlertCircle, Plus, XCircle, Code, Layout, PanelLeftClose, PanelLeftOpen, Trash2 } from 'lucide-react';
import JsonNode from '@/components/JsonCmsEditor';
import dynamic from 'next/dynamic';

const PuckEditor = dynamic(() => import('@/components/PuckEditor'), { ssr: false });

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
  const [isPuckVisible, setIsPuckVisible] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const handleDeletePage = async (page: Page) => {
    if (!window.confirm(`Are you sure you want to delete the page "${page.title}" and all its sections? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/cms/pages?id=${page.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete page');

      setPages(prev => prev.filter(p => p.id !== page.id));
      if (selectedPage?.id === page.id) {
        setSelectedPage(null);
        setSections([]);
      }
      alert('Page deleted successfully');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;

    try {
      const res = await fetch(`/api/cms/sections?id=${sectionId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete section');

      setSections(prev => prev.filter(s => s.id !== sectionId));
      alert('Section deleted successfully');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePuckPublish = async (puckData: any) => {
    if (!selectedPage) return;
    setSaving(true);
    try {
      // Find or create puck_data section
      let puckSection = sections.find(s => s.section_key === 'puck_data');

      if (!puckSection) {
        const res = await fetch('/api/cms/sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_id: selectedPage.id,
            section_key: 'puck_data',
            title: 'Puck Data',
            content: puckData
          })
        });
        if (!res.ok) throw new Error('Failed to create puck section');
        const data = await res.json();
        setSections([...sections, data.section]);
      } else {
        const response = await fetch('/api/cms/sections', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: puckSection.id,
            content: puckData
          })
        });
        if (!response.ok) throw new Error('Failed to save puck data');
        const data = await response.json();
        setSections(prev => prev.map(s => s.id === puckSection?.id ? { ...s, content: data.section.content } : s));
      }
      alert('Page published via Drag & Drop successfully!');
    } catch (err: any) {
      alert('Publishing error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Transform existing sections into Puck data if puck_data doesn't exist
  const puckInitialData = useMemo(() => {
    const existingPuck = sections.find(s => s.section_key === 'puck_data')?.content;
    if (existingPuck && existingPuck.content) {
      // Ensure every item has a unique ID to satisfy Puck's internal list keys
      const sanitizedContent = existingPuck.content.map((item: any, idx: number) => ({
        ...item,
        id: item.id || `item-${idx}-${Date.now()}`
      }));
      return {
        ...existingPuck,
        content: sanitizedContent,
        root: existingPuck.root || { props: { title: selectedPage?.title || "" } }
      };
    }

    // Attempt to convert traditional sections to Puck components
    const convertedContent = sections
      .filter(s => s.section_key !== 'puck_data')
      .map(s => {
        const key = s.section_key;
        const c = s.content;

        if (key === 'hero') {
          return {
            type: "Hero",
            props: {
              heading: c.heading,
              subheading: c.subheading,
              description: c.description,
              video_src: c.video_src,
              cta_primary_text: c.cta_primary?.text,
              cta_primary_link: c.cta_primary?.link
            },
            id: `hero-${s.id}`
          };
        }
        if (key === 'services_intro' || key === 'services_list') {
          return {
            type: "Services",
            props: {
              title: c.title,
              description: c.description,
              services: c.services_list?.map((ser: any) => ({
                icon: ser.icon,
                title: ser.title,
                description: ser.description
              }))
            },
            id: `services-${s.id}`
          };
        }
        if (key === 'about_summary') {
          return {
            type: "About",
            props: {
              title: c.title,
              content: c.content?.map((p: string) => ({ paragraph: p })),
              qualifications: c.qualifications?.map((q: string) => ({ item: q })),
              contact_title: c.contact_box?.title,
              contact_description: c.contact_box?.description,
              phone: c.contact_box?.phone,
              email: c.contact_box?.email
            },
            id: `about-${s.id}`
          };
        }

        return {
          type: "SectionHeader",
          props: {
            title: s.title || key,
            subtitle: typeof c === 'string' ? c : JSON.stringify(c).substring(0, 100)
          },
          id: `header-${s.id}`
        };
      })
      .filter(Boolean);

    return {
      content: convertedContent,
      root: { props: { title: selectedPage?.title || "" } }
    };
  }, [sections, selectedPage]);

  if (!pages) return <div className="p-8">Loading CMS...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className={`${isSidebarCollapsed ? 'max-w-none' : 'max-w-7xl'} mx-auto transition-all duration-300`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 hover:text-teal-600 transition-colors"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          </div>
          <button
            onClick={() => router.push('/secure-access/admin')}
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className={`flex flex-col md:flex-row gap-6 transition-all duration-300`}>
          {/* Sidebar: Page List */}
          {!isSidebarCollapsed && (
            <div className="w-full md:w-64 bg-white rounded-xl shadow-sm p-4 h-fit shrink-0">
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
                  <div key={page.id} className="group flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPage(page)}
                      className={`flex-1 text-left px-4 py-2 rounded-lg transition-colors ${selectedPage?.id === page.id
                        ? 'bg-teal-50 text-teal-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {page.title}
                    </button>
                    <button
                      onClick={() => handleDeletePage(page)}
                      className="p-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                      title="Delete page"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </nav>
            </div>
          )}

          {/* Main Area: Section Editor */}
          <div className="flex-1 min-w-0">
            {selectedPage ? (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedPage.title}</h2>
                    <p className="text-gray-500 text-sm">Update content sections for this page.</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsPuckVisible(!isPuckVisible)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium border ${isPuckVisible ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'}`}
                    >
                      <Layout size={16} />
                      {isPuckVisible ? 'Close Visual Editor' : 'Open Visual Editor'}
                    </button>
                    {!isPuckVisible && (
                      <button
                        onClick={() => setShowNewSection(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium"
                      >
                        <Plus size={16} />
                        Add Section
                      </button>
                    )}
                  </div>
                </div>

                {isPuckVisible ? (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-visible relative" style={{ minHeight: '800px' }}>
                    {loading ? (
                      <div className="flex items-center justify-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                      </div>
                    ) : (
                      <PuckEditor
                        key={selectedPage.id}
                        data={puckInitialData}
                        onPublish={handlePuckPublish}
                      />
                    )}
                  </div>
                ) : (
                  loading ? (
                    <div className="text-center py-12">Loading sections...</div>
                  ) : (
                    <div className="space-y-6">
                      {sections.map((section) => (
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
                              <button
                                onClick={() => handleDeleteSection(section.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Section"
                              >
                                <Trash2 size={16} />
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
                                  className="w-full font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-teal-500 focus:border-transparent "
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
                      ))}
                    </div>
                  )
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
