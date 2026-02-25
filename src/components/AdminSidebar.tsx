'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Calendar,
  BookOpen,
  MessageSquare,
  Settings,
  Edit,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Sparkles,
  Search,
  Database,
  ArrowRightLeft,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ onLogout, activeTab, setActiveTab, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'blogs', label: 'Blogs', icon: BookOpen },
    { id: 'contact', label: 'Contact', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const secondaryItems = [
    { id: 'cms', label: 'Content Builder', icon: Edit, href: '/secure-access/admin/cms' },
  ];

  const handleTabClick = (id: string, href?: string) => {
    if (href) {
      router.push(href);
    } else {
      setActiveTab(id);
      if (pathname !== '/secure-access/admin') {
        router.push('/secure-access/admin');
      }
    }
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen ${isCollapsed ? 'w-24' : 'w-72'} bg-gray-900 text-white flex flex-col z-50 border-r border-gray-800 shadow-2xl overflow-hidden transition-all duration-300`}>
      {/* Brand Logo & Collapse Toggle */}
      <div className={`p-6 border-b border-gray-800/50 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-2xl flex items-center justify-center p-0.5 shadow-lg shadow-teal-500/20 rotate-3 shrink-0">
            <div className="bg-gray-900 w-full h-full rounded-[14px] flex items-center justify-center -rotate-3">
              <Sparkles className="text-teal-400" size={24} />
            </div>
          </div>
          {!isCollapsed && (
            <div className="animate-in fade-in slide-in-from-left-2 transition-all">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
                WELLNESS
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-teal-500/80">
                Wellness IV Drip
              </p>
            </div>
          )}
        </div>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={`p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-500 hover:text-white ${isCollapsed ? 'hidden' : 'block'}`}
          >
            <PanelLeftClose size={20} />
          </button>
        )}
      </div>

      {isCollapsed && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="mx-auto my-4 p-3 bg-gray-800 hover:bg-gray-700 rounded-2xl text-teal-400 transition-all hover:scale-110"
        >
          <PanelLeftOpen size={20} />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto custom-scrollbar">
        <div>
          {!isCollapsed && (
            <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
              Main Navigation
            </p>
          )}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3.5 rounded-xl transition-all duration-200 group relative ${activeTab === item.id
                  ? 'bg-teal-500/10 text-teal-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-teal-400' : 'text-gray-50 group-hover:text-white transition-colors'} />
                {!isCollapsed && <span className="font-semibold text-sm">{item.label}</span>}
                {activeTab === item.id && (
                  <div className="absolute left-0 w-1 h-6 bg-teal-500 rounded-r-full" />
                )}
                {!isCollapsed && <ChevronRight size={14} className={`ml-auto opacity-0 group-hover:opacity-40 transition-all ${activeTab === item.id ? 'opacity-40 translate-x-1' : ''}`} />}
              </button>
            ))}
          </div>
        </div>

        <div>
          {!isCollapsed && (
            <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
              Advanced Tools
            </p>
          )}
          <div className="space-y-1">
            {secondaryItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id, item.href)}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group`}
              >
                <div className={`bg-gray-800 p-1.5 rounded-lg group-hover:bg-gray-700 transition-colors ${isCollapsed ? 'p-2' : ''}`}>
                  <item.icon size={18} />
                </div>
                {!isCollapsed && <span className="font-semibold text-sm">{item.label}</span>}
                {!isCollapsed && <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0 transition-all" />}
              </button>
            ))}

            {/* Supabase Vector Indicator */}
            <div className={`mt-6 ${isCollapsed ? 'flex justify-center' : 'px-4'}`}>
              <div className={`bg-teal-900/20 border border-teal-500/10 rounded-2xl ${isCollapsed ? 'p-3' : 'p-4'}`}>
                <div className={`flex items-center gap-2 text-teal-400 ${isCollapsed ? '' : 'mb-2'}`}>
                  <Database size={14} />
                  {!isCollapsed && <span className="text-[10px] font-bold uppercase tracking-wider">Vector Status</span>}
                </div>
                {!isCollapsed && (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[11px] text-teal-100/70 font-medium">Embedding Engine Active</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* User Footer */}
      <div className={`p-6 bg-gray-950/50 border-t border-gray-800 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
        <button
          onClick={onLogout}
          title={isCollapsed ? 'Sign Out' : ''}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 group`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-bold text-sm">Sign Out</span>}
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #374151;
        }
      `}</style>
    </aside>
  );
}
