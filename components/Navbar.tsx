'use client';

import { Bell, Search, User } from 'lucide-react';

interface NavbarProps {
  userName?: string;
}

export default function Navbar({ userName }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-rose-100 dark:border-purple-800 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 h-12">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-rose-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-pink-500"
            />
          </div>
        </div>

        {/* Right side - Notifications and User */}
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-pink-400 hover:bg-rose-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
          
          {userName && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 dark:bg-purple-900/30 rounded-lg">
              <User className="w-3.5 h-3.5 text-rose-500 dark:text-pink-400" />
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
                {userName}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
