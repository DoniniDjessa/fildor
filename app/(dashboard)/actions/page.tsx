import { requireAdmin } from '@/lib/auth/checkAccess';
import { getActionsByTable } from '@/lib/actions/actions.actions';
import ActionsList from '@/components/actions/ActionsList';

export default async function ActionsPage() {
  await requireAdmin();
  const actions = await getActionsByTable('ct-clients');

  return (
      <div className="h-full flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-[30px] shadow-lg p-6 border border-white/20 dark:border-white/10">
      <div className="mb-4 flex-shrink-0">
        <h1 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100 mb-1">
          Actions / Historique
        </h1>
        <p className="text-sm text-[#808191] dark:text-gray-400">
          Historique des suppressions de clients
        </p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <ActionsList actions={actions} />
      </div>
    </div>
  );
}

