'use client';

import { Trash2, User, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Action {
  id: string;
  action_type: string;
  table_name: string;
  record_id: string;
  record_data: {
    id: string;
    name: string;
    phone?: string;
    whatsapp?: string;
    notes?: string;
    created_at: string;
  };
  user: {
    name: string;
    email: string;
  } | null;
  created_at: string;
}

interface ActionsListProps {
  actions: Action[];
}

export default function ActionsList({ actions }: ActionsListProps) {
  if (actions.length === 0) {
    return (
      <div className="text-center py-8">
        <Trash2 className="w-12 h-12 mx-auto text-gray-400 mb-2" />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Aucune action enregistrée
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {actions.map((action) => {
        const clientData = action.record_data;
        const actionDate = new Date(action.created_at);

        return (
          <div
            key={action.id}
            className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg"
          >
            <div className="flex items-start gap-2 mb-2">
              <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-3 h-3 text-gray-400" />
                  <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100">
                    {clientData.name}
                  </h3>
                </div>
                {clientData.phone && (
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">
                    📞 {clientData.phone}
                  </p>
                )}
                {clientData.whatsapp && (
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">
                    💬 {clientData.whatsapp}
                  </p>
                )}
                {clientData.notes && (
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {clientData.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-red-200 dark:border-red-800/30">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {format(actionDate, "dd MMM yyyy 'à' HH:mm")}
                </p>
              </div>
              {action.user && (
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  Par {action.user.name}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

