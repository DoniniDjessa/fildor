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
    <div className="flex h-screen bg-[#F0F3F8] dark:bg-[#0F1117] overflow-hidden">
      <div className="flex items-stretch gap-4 p-4 flex-1 min-w-0">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar userName={userName} />
          <main className="flex-1 p-4 lg:p-6 transition-all duration-300 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
