'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function RightSidebar({ isOpen, onClose, title, children }: RightSidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) {
    return null;
  }

  const sidebarContent = (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9999]"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 h-screen w-full sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] max-w-md bg-white/95 dark:bg-[#1A1D29]/95 backdrop-blur-lg border-l border-white/20 dark:border-white/10 z-[9999] transition-all duration-300 ease-in-out shadow-2xl ${
          isOpen
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-white/10">
            <h2 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-[#808191] hover:text-[#11142D] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 rounded-[30px] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </aside>
    </>
  );

  return createPortal(sidebarContent, document.body);
}

