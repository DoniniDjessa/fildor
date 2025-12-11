'use client';

import HeroCard from '@/components/dashboard/HeroCard';
import QuickActionCard from '@/components/dashboard/QuickActionCard';
import StatusCard from '@/components/dashboard/StatusCard';
import RightPanel from '@/components/dashboard/RightPanel';
import { Ruler, Plus, Scissors, Shirt } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleNewMeasure = () => {
    router.push('/mesures');
  };

  const handleNewOrder = () => {
    router.push('/commandes');
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100 mb-0.5">
          Tableau de bord
        </h1>
        <p className="font-poppins text-[10px] text-[#808191] dark:text-gray-400">
          Vue d&apos;ensemble de l&apos;atelier
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left Section - Hero Card and Quick Actions */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Hero Card and Quick Actions Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Hero Card - Takes 2 columns */}
            <div className="col-span-2">
              <HeroCard />
            </div>

            {/* Quick Actions - Takes 1 column */}
            <div className="flex flex-col gap-3">
              <QuickActionCard
                title="Nouvelle Mesure"
                icon={Ruler}
                color="purple"
                onClick={handleNewMeasure}
              />
              <QuickActionCard
                title="Nouvelle Commande"
                icon={Plus}
                color="pink"
                onClick={handleNewOrder}
              />
            </div>
          </div>

          {/* Status Cards - Commandes en cours */}
          <div>
            <h2 className="font-title text-[#11142D] dark:text-gray-100 font-semibold text-sm mb-3">
              Commandes en cours
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatusCard
                title="Robe Mariée - Mme Koffi"
                subtitle="Essayage : Demain 14h"
                progress={75}
                status="urgent"
                icon={Shirt}
                iconColor="#6C5DD3"
              />
              <StatusCard
                title="Costume - M. Diallo"
                subtitle="Livraison : Vendredi 16h"
                progress={45}
                status="normal"
                icon={Scissors}
                iconColor="#3F8CFF"
              />
              <StatusCard
                title="Robe de Soirée - Mme Traoré"
                subtitle="Essayage : Mercredi 10h"
                progress={90}
                status="normal"
                icon={Shirt}
                iconColor="#6C5DD3"
              />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-shrink-0">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
