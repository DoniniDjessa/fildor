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
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700 text-white text-xs font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
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

