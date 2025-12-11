'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import CreateClientForm from './CreateClientForm';

export default function CreateClientButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#6C5DD3] to-[#8B7AE8] hover:from-[#5A4BC2] hover:to-[#7A6AD8] text-white text-sm font-medium rounded-[30px] shadow-lg hover:shadow-xl transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Nouveau</span>
      </button>

      <CreateClientForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          setIsOpen(false);
          window.location.reload();
        }}
      />
    </>
  );
}

