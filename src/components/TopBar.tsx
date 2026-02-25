'use client';

import React from 'react';
import { Search, Bell, User, Sparkles, Command } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-gray-400 group-focus-within:text-teal-500 transition-colors" size={20} />
        </div>
        <input
          type="text"
          placeholder="Type to search bookings, blogs or documentation..."
          className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-16 focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all text-sm font-medium"
        />
        <div className="absolute inset-y-0 right-4 flex items-center gap-1">
          <div className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 text-[10px] font-bold">
            <Command size={10} className="inline mr-0.5" /> K
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full border border-teal-100 animate-in fade-in slide-in-from-right-2">
          <Sparkles size={14} className="animate-pulse" />
          <span className="text-xs font-bold tracking-tight uppercase">AI Optimization Active</span>
        </div>

        <button className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-10 w-[1px] bg-gray-100 mx-2" />

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900 leading-none">Admin User</p>
            <p className="text-[10px] font-bold text-teal-600 uppercase mt-1 tracking-tighter">Site Master</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 p-0.5">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overlow-hidden border-2 border-white">
              <User className="text-teal-600" size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
