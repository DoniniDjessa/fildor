'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  UserCircle, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X, 
  History,
  ShoppingBag,
  Ruler,
  BookOpen,
  Settings,
  Package,
  MessageSquare,
  Phone,
  Bell,
  DollarSign,
  Receipt
} from 'lucide-react';
import { signOut } from '@/lib/auth/actions';

const menuItems = [
  {
    label: 'Tableau de bord',
    href: '/',
    icon: LayoutDashboard,
    disabled: false,
  },
  {
    label: 'Commandes',
    href: '/commandes',
    icon: ShoppingBag,
    disabled: false,
  },
  // {
  //   label: 'Mesures',
  //   href: '/mesures',
  //   icon: Ruler,
  //   disabled: false,
  // },
  {
    label: 'Catalogue Modèles',
    href: '/catalogue',
    icon: BookOpen,
    disabled: false,
  },
  {
    label: 'Stock',
    href: '/stock',
    icon: Package,
    disabled: false,
  },
  {
    label: 'Clients',
    href: '/clients',
    icon: UserCircle,
    disabled: false,
  },
  {
    label: 'Utilisateurs',
    href: '/utilisateurs',
    icon: Users,
    disabled: false,
  },
  {
    label: 'SMS',
    href: '#',
    icon: MessageSquare,
    disabled: true,
  },
  {
    label: 'WhatsApp',
    href: '#',
    icon: Phone,
    disabled: true,
  },
  {
    label: 'Notifications',
    href: '#',
    icon: Bell,
    disabled: true,
  },
  {
    label: 'Dépenses',
    href: '#',
    icon: DollarSign,
    disabled: true,
  },
  {
    label: 'Comptabilité',
    href: '#',
    icon: Receipt,
    disabled: true,
  },
  {
    label: 'Actions',
    href: '/actions',
    icon: History,
    disabled: true,
  },
  {
    label: 'Paramètres',
    href: '/parametres',
    icon: Settings,
    disabled: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`relative bg-[#6C5DD3] rounded-[40px] shadow-2xl transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 h-full ${
        isCollapsed 
          ? 'w-16 md:w-20' 
          : 'w-48 md:w-48'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header with Toggle Button */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="font-title text-base font-bold text-white">
              Fil d&apos;Or
            </h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-[30px] transition-all hover:scale-110 flex-shrink-0"
          >
            {isCollapsed ? (
              <Menu className="w-3.5 h-3.5 text-white" />
            ) : (
              <X className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 p-2 space-y-1 overflow-y-auto ${
          isCollapsed ? 'scrollbar-hide' : ''
        }`}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isDisabled = item.disabled;

            const content = (
              <div
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-2 text-xs font-title font-medium rounded-[25px] transition-all relative group ${
                  isDisabled
                    ? 'text-white/30 cursor-not-allowed'
                    : isActive
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                title={isCollapsed ? item.label : isDisabled ? `${item.label} (bientôt disponible)` : undefined}
              >
                {isActive && !isCollapsed && !isDisabled && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full" />
                )}
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="whitespace-nowrap font-title">{item.label}</span>
                )}
                {/* Tooltip when collapsed */}
                {isCollapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-[#11142D] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 font-title">
                    {item.label} {isDisabled && '(bientôt disponible)'}
                  </span>
                )}
              </div>
            );

            // Use label as key for disabled items to avoid duplicate keys
            const uniqueKey = isDisabled ? `disabled-${item.label}` : item.href;

            if (isDisabled) {
              return <div key={uniqueKey}>{content}</div>;
            }

            return (
              <Link key={uniqueKey} href={item.href} title={isCollapsed ? item.label : undefined}>
                {content}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-2 border-t border-white/10">
          <form action={signOut}>
            <button
              type="submit"
              title={isCollapsed ? 'Déconnexion' : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-2 w-full text-xs font-title font-medium text-white/80 hover:bg-white/10 hover:text-white rounded-[25px] transition-all group`}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="font-title">Déconnexion</span>}
              {/* Tooltip when collapsed */}
              {isCollapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-[#11142D] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 font-title">
                  Déconnexion
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
