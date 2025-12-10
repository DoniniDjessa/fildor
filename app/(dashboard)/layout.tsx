import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { getCurrentUser } from '@/lib/auth/actions';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const userName = user?.profile?.name || user?.email?.split('@')[0] || undefined;

  return (
    <div className="flex h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={userName} />
        <main className="flex-1 p-4 lg:p-6 transition-all duration-300 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
