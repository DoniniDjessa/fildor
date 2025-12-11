'use client';

import { useState } from 'react';
import CoutureWorkArea from './CoutureWorkArea';
import ActivityFeed from './ActivityFeed';

export default function CouturePageContent() {
  return (
    <div className="h-full flex gap-4">
      {/* Zone Gauche : Espace de Travail (65%) */}
      <div className="flex-1 w-[65%] bg-white/80 dark:bg-[#1A1D29]/80 backdrop-blur-lg rounded-[30px] shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
        <CoutureWorkArea />
      </div>

      {/* Zone Droite : Live Feed Atelier (35%) */}
      <div className="w-[35%] bg-white dark:bg-[#1A1D29] border-l border-slate-100 dark:border-slate-800 shadow-lg">
        <ActivityFeed />
      </div>
    </div>
  );
}

