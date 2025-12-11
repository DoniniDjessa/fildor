'use client';

import { Bell, Search, User, Calculator, Scale, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  userName?: string;
}

export default function Navbar({ userName }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-30 border-b border-white/20 dark:border-white/10">
      <div className="flex items-center justify-between px-4 py-2.5 h-12">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#808191]" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-[30px] border border-white/20 dark:border-white/10 bg-white/50 dark:bg-[#1A1D29]/50 text-[#11142D] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 dark:focus:ring-[#6C5DD3]/30 transition-all"
            />
          </div>
        </div>

        {/* Right side - Tools and User */}
        <div className="flex items-center gap-2">
          {/* Calculator - Disabled */}
          <button 
            disabled
            className="p-1.5 text-[#808191]/50 dark:text-gray-600 cursor-not-allowed rounded-[30px] transition-colors"
            title="Calculatrice (bientôt disponible)"
          >
            <Calculator className="w-4 h-4" />
          </button>

          {/* Converter - Disabled */}
          <button 
            disabled
            className="p-1.5 text-[#808191]/50 dark:text-gray-600 cursor-not-allowed rounded-[30px] transition-colors"
            title="Convertisseur gramme/kg (bientôt disponible)"
          >
            <Scale className="w-4 h-4" />
          </button>

          {/* Dark/Light Mode - Disabled */}
          <button 
            disabled
            className="p-1.5 text-[#808191]/50 dark:text-gray-600 cursor-not-allowed rounded-[30px] transition-colors"
            title="Mode sombre/clair (bientôt disponible)"
          >
            <Moon className="w-4 h-4 dark:hidden" />
            <Sun className="w-4 h-4 hidden dark:block" />
          </button>

          <button className="p-1.5 text-[#808191] hover:text-[#11142D] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 rounded-[30px] transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#FF754C] rounded-full border-2 border-white dark:border-[#1A1D29]"></span>
          </button>
          
          {userName && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 dark:bg-white/10 rounded-[30px]">
              <User className="w-3.5 h-3.5 text-[#6C5DD3]" />
              <span className="text-xs font-medium text-[#11142D] dark:text-gray-300">
                {userName}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
