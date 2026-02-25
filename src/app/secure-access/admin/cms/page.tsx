'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Save, AlertCircle, Plus, XCircle, Code, Layout, PanelLeftClose, PanelLeftOpen, Trash2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import JsonNode from '@/components/JsonCmsEditor';
import AiCommandBar from '@/components/AiCommandBar';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/AdminSidebar';
import TopBar from '@/components/TopBar';
import { useToast } from '@/components/Toast';

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
  const [isMainSidebarCollapsed, setIsMainSidebarCollapsed] = useState(false);
  const [isPagesSidebarCollapsed, setIsPagesSidebarCollapsed] = useState(false);

  // Modals state
  const [showNewPage, setShowNewPage] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '', meta_description: '' });
  const [showNewSection, setShowNewSection] = useState(false);
  const [newSection, setNewSection] = useState({ section_key: '', title: '' });

  // View mode state for sections (visual vs json)
  // maps sectionId -> boolean
  const [visualMode, setVisualMode] = useState<Record<string, boolean>>({});

  const { showToast } = useToast();
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
      showToast('Section updated successfully!', 'success');
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
      showToast('Page published via Drag & Drop successfully!', 'success');
    } catch (err: any) {
      showToast('Publishing error: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Transform existing sections into Puck data if puck_data doesn't exist
  const puckInitialData = useMemo(() => {
    const existingPuck = sections.find(s => s.section_key === 'puck_data')?.content;
    if (existingPuck && existingPuck.content) {
      // Sanitize: ensure every item has id inside props (Puck v0.21 requirement)
      const sanitizedContent = (existingPuck.content || []).map((item: any, idx: number) => {
        const itemId = item.props?.id || item.id?.toString() || `existing-${idx}`;
        return {
          type: item.type,
          props: {
            ...item.props,
            id: itemId
          }
        };
      });
      return {
        content: sanitizedContent,
        root: existingPuck.root || { props: { title: selectedPage?.title || "" } }
      };
    }

    // Convert traditional sections to Puck components
    const convertedContent = sections
      .filter(s => s.section_key !== 'puck_data')
      .map((s, sIdx) => {
        const key = s.section_key;
        const c = s.content || {};
        const baseId = `${key}-${s.id || sIdx}`;

        if (key === 'hero') {
          return {
            type: "Hero",
            props: {
              id: baseId,
              heading: c.heading || "",
              subheading: c.subheading || "",
              description: c.description || "",
              video_src: c.video_src || "/bg-video.mp4",
              cta_primary_text: c.cta_primary?.text || "Book Now",
              cta_primary_link: c.cta_primary?.link || "/booking",
              cta_secondary_text: c.cta_secondary?.text || "Watch Video"
            }
          };
        }
        if (key === 'services_intro' || key === 'services_list') {
          return {
            type: "Services",
            props: {
              id: baseId,
              title: c.title || "Our Services",
              description: c.description || "",
              services: Array.isArray(c.services_list)
                ? c.services_list.map((ser: any, idx: number) => ({
                  icon: ser.icon || "💧",
                  title: ser.title || "Service",
                  description: ser.description || ""
                }))
                : []
            }
          };
        }
        if (key === 'about_summary') {
          return {
            type: "About",
            props: {
              id: baseId,
              title: c.title || "About Us",
              content: Array.isArray(c.content) ? c.content.map((p: string) => ({ paragraph: p })) : [],
              qualifications: Array.isArray(c.qualifications) ? c.qualifications.map((q: string) => ({ item: q })) : [],
              contact_title: c.contact_box?.title || "Contact Us",
              contact_description: c.contact_box?.description || "",
              phone: c.contact_box?.phone || "",
              email: c.contact_box?.email || ""
            }
          };
        }
        if (key === 'tabs') {
          return {
            type: "Tabs",
            props: {
              id: baseId,
              tabs: Array.isArray(c.tabs) ? c.tabs.map((t: any, idx: number) => ({ label: t.label || `Tab ${idx + 1}`, content: t.content || "" })) : []
            }
          };
        }
        if (key === 'carousel') {
          return {
            type: "Carousel",
            props: {
              id: baseId,
              items: Array.isArray(c.items) ? c.items.map((i: any) => ({
                title: i.title || "",
                description: i.description || "",
                image: i.image || "",
                image_alt: i.image_alt || ""
              })) : []
            }
          };
        }
        if (key === 'gallery') {
          return {
            type: "Gallery",
            props: {
              id: baseId,
              title: c.title || "Gallery",
              images: Array.isArray(c.images) ? c.images.map((img: any) => ({
                url: img.url || "",
                caption: img.caption || "",
                alt: img.alt || ""
              })) : []
            }
          };
        }
        if (key === 'cta') {
          return {
            type: "CallToAction",
            props: {
              id: baseId,
              title: c.title || "",
              description: c.description || "",
              button_text: c.button?.text || "Book Now",
              button_href: c.button?.link || "/booking",
              theme: c.theme || "accent"
            }
          };
        }
        if (key === 'table') {
          return {
            type: "Table",
            props: {
              id: baseId,
              caption: c.caption || "",
              headers: Array.isArray(c.headers) ? c.headers.map((h: any) => ({ text: h.text || h })) : [],
              rows: Array.isArray(c.rows) ? c.rows.map((r: any) => ({
                cells: Array.isArray(r.cells) ? r.cells.map((cell: any) => ({ text: cell.text || cell })) : []
              })) : []
            }
          };
        }

        return {
          type: "SectionHeader",
          props: {
            id: baseId,
            title: s.title || key,
            subtitle: typeof c === 'string' ? c : (c.subtitle || JSON.stringify(c).substring(0, 50))
          }
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
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar
        onLogout={() => router.push('/')}
        activeTab="cms"
        setActiveTab={() => { }}
        isCollapsed={isMainSidebarCollapsed}
        onToggleCollapse={() => setIsMainSidebarCollapsed(!isMainSidebarCollapsed)}
      />

      <div className={`flex-1 ${isMainSidebarCollapsed ? 'ml-24' : 'ml-72'} flex flex-col min-h-screen transition-all duration-300`}>
        <TopBar />

        <main className="flex-1 p-8 min-w-0">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Content Architect</h1>
                <p className="text-gray-500 font-medium">Design and optimize your site with AI-driven tools</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                  <button
                    onClick={() => setIsPuckVisible(false)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${!isPuckVisible ? 'bg-teal-500 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Structure
                  </button>
                  <button
                    onClick={() => setIsPuckVisible(true)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isPuckVisible ? 'bg-teal-500 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Visuals
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Pages & Context */}
              <div className={`transition-all duration-500 ease-in-out ${isPagesSidebarCollapsed ? 'lg:col-span-1 w-16' : 'lg:col-span-3'} space-y-6 relative`}>
                <button
                  onClick={() => setIsPagesSidebarCollapsed(!isPagesSidebarCollapsed)}
                  className={`absolute -right-4 top-10 w-8 h-8 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center z-10 hover:bg-teal-500 hover:text-white transition-all text-gray-400`}
                >
                  {isPagesSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                </button>

                <div className={`bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 transition-all duration-300 ${isPagesSidebarCollapsed ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-black uppercase tracking-[0.15em] text-gray-400">Pages</h2>
                    <button
                      onClick={() => setShowNewPage(true)}
                      className="w-8 h-8 flex items-center justify-center bg-teal-50 text-teal-600 rounded-full hover:bg-teal-500 hover:text-white transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {pages.map(page => (
                      <button
                        key={page.id}
                        onClick={() => setSelectedPage(page)}
                        className={`w-full text-left px-5 py-3.5 rounded-2xl transition-all group flex items-center justify-between ${selectedPage?.id === page.id
                          ? 'bg-gray-900 text-white shadow-xl'
                          : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <span className="font-bold text-sm">{page.title}</span>
                        <ArrowRight size={14} className={`transition-transform duration-300 ${selectedPage?.id === page.id ? 'translate-x-0' : '-translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`bg-gradient-to-br from-indigo-600 to-teal-500 rounded-[32px] p-6 text-white shadow-xl transition-all duration-300 ${isPagesSidebarCollapsed ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={18} />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Agent Intelligence</span>
                  </div>
                  <p className="text-sm font-medium text-white/90 leading-relaxed mb-6">
                    I'm currently optimizing {sections.length} components. Ready to scale your content.
                  </p>
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-white/60">
                      <span>Vector Ready</span>
                      <span>98%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[98%] bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Editor Area */}
              <div className={`transition-all duration-500 ${isPagesSidebarCollapsed ? 'lg:col-span-11' : 'lg:col-span-9'}`}>
                {selectedPage ? (
                  <div className="space-y-8">
                    <AiCommandBar pageId={selectedPage.id} onRefresh={() => {
                      fetch(`/api/cms/sections?pageId=${selectedPage.id}`)
                        .then(res => res.json())
                        .then(data => setSections(data.sections));
                    }} />

                    <div className="bg-white rounded-[32px] shadow-sm p-8 border border-gray-100 flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">{selectedPage.title}</h2>
                        <p className="text-gray-500 text-sm font-medium">Active Configuration • {sections.length} Sections</p>
                      </div>
                      <div className="flex gap-3">
                        {!isPuckVisible && (
                          <button
                            onClick={() => setShowNewSection(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all text-sm font-bold shadow-lg shadow-gray-900/10"
                          >
                            <Plus size={16} />
                            New Block
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePage(selectedPage)}
                          className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    {isPuckVisible ? (
                      <div className="bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-visible relative min-h-[800px]">
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
                        <div className="flex items-center justify-center py-20">
                          <div className="animate-pulse text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing Components...</div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {sections.map((section) => (
                            <div key={section.id} className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-gray-100 group hover:border-teal-200 transition-all">
                              <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100 flex justify-between items-center group-hover:bg-teal-50/30 transition-all">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                                  <span className="font-black text-gray-900 uppercase text-xs tracking-widest">
                                    {section.section_key}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => setVisualMode(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-xs font-black uppercase tracking-wider border ${visualMode[section.id] ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                                  >
                                    {visualMode[section.id] ? <Code size={14} /> : <Layout size={14} />}
                                    {visualMode[section.id] ? 'JSON' : 'Node'}
                                  </button>
                                  <button
                                    onClick={() => handleSave(section)}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all text-xs font-black uppercase tracking-wider shadow-lg shadow-teal-500/10"
                                  >
                                    <Save size={14} />
                                    {saving ? '...' : 'Sync'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSection(section.id)}
                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                              <div className="p-8">
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
                                  <div className="relative">
                                    <textarea
                                      rows={10}
                                      className="w-full font-mono text-xs bg-gray-50/50 border-none focus:ring-2 focus:ring-teal-500/20 rounded-2xl p-6 text-gray-600 leading-relaxed"
                                      value={typeof section.content === 'string'
                                        ? section.content
                                        : JSON.stringify(section.content, null, 2)}
                                      onChange={(e) => handleContentChange(section.id, e.target.value)}
                                    />
                                    {jsonError && (
                                      <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                                        <AlertCircle size={12} />
                                        Struct Error
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                      <Layout className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Page Selected</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">Select a page from the architect sidebar to begin editing or creating content.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {showNewPage && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in zoom-in-95">
          <div className="bg-white rounded-[40px] shadow-2xl p-10 w-full max-w-lg border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Blueprint New Page</h2>
                <p className="text-sm text-gray-500 mt-1">Configure your entry point</p>
              </div>
              <button
                onClick={() => setShowNewPage(false)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleCreatePage} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Page Title</label>
                <input required type="text" value={newPage.title} onChange={e => setNewPage({ ...newPage, title: e.target.value })} className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-teal-500/20 font-bold" placeholder="e.g. Services" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Url Slug</label>
                <input required type="text" value={newPage.slug} onChange={e => setNewPage({ ...newPage, slug: e.target.value })} className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-teal-500/20 font-bold" placeholder="e.g. services" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Meta Insights</label>
                <textarea rows={3} value={newPage.meta_description} onChange={e => setNewPage({ ...newPage, meta_description: e.target.value })} className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-teal-500/20 font-medium text-sm" placeholder="SEO Description..." />
              </div>
              <button type="submit" className="w-full bg-teal-500 text-white rounded-3xl py-4 font-black shadow-xl shadow-teal-500/20 hover:bg-teal-600 transition-all uppercase tracking-widest text-xs">
                Launch Page
              </button>
            </form>
          </div>
        </div>
      )}

      {showNewSection && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in zoom-in-95">
          <div className="bg-white rounded-[40px] shadow-2xl p-10 w-full max-w-lg border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Define Block</h2>
                <p className="text-sm text-gray-500 mt-1">Adding to {selectedPage?.title}</p>
              </div>
              <button
                onClick={() => setShowNewSection(false)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateSection} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Component Key</label>
                <input required type="text" value={newSection.section_key} onChange={e => setNewSection({ ...newSection, section_key: e.target.value })} className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-teal-500/20 font-bold" placeholder="e.g. hero" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Internal Title</label>
                <input type="text" value={newSection.title} onChange={e => setNewSection({ ...newSection, title: e.target.value })} className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-teal-500/20 font-bold" placeholder="e.g. Hero Section" />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white rounded-3xl py-4 font-black shadow-xl shadow-gray-900/10 hover:bg-gray-800 transition-all uppercase tracking-widest text-xs">
                Integrate Block
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
