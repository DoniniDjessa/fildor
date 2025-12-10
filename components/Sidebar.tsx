'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, UserCircle, LogOut, LayoutDashboard, Menu, X, History } from 'lucide-react';
import { signOut } from '@/lib/auth/actions';

const menuItems = [
  {
    label: 'Tableau de bord',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Utilisateurs',
    href: '/utilisateurs',
    icon: Users,
  },
  {
    label: 'Clients',
    href: '/clients',
    icon: UserCircle,
  },
  {
    label: 'Actions',
    href: '/actions',
    icon: History,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={toggleSidebar}
        className={`fixed left-4 top-4 z-50 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-lg border border-rose-200 dark:border-purple-700 shadow-lg transition-all hover:scale-110 ${
          !isCollapsed ? 'left-[260px]' : ''
        }`}
      >
        {isCollapsed ? (
          <Menu className="w-4 h-4 text-rose-500" />
        ) : (
          <X className="w-4 h-4 text-rose-500" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-r border-rose-100 dark:border-purple-800 z-40 transition-all duration-300 ease-in-out ${
          isCollapsed
            ? '-translate-x-full w-0 opacity-0'
            : 'translate-x-0 w-64 opacity-100'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-rose-100 dark:border-purple-800">
            <h1 className="font-title text-lg font-bold bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
              Fil d&apos;Or
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsCollapsed(true)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-400 to-pink-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-purple-900/30'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-3 border-t border-rose-100 dark:border-purple-800">
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 w-full text-xs font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-rose-50 dark:hover:bg-purple-900/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Overlay when sidebar is open on mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
}
