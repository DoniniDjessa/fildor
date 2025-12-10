import { getClients, deleteClient } from '@/lib/actions/clients.actions';
import ClientsList from '@/components/clients/ClientsList';
import CreateClientButton from '@/components/clients/CreateClientButton';

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-rose-100 dark:border-purple-800">
      <div className="mb-4 flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="font-title text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
            Clients
          </h1>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            Gérer les clients de l&apos;atelier
          </p>
        </div>
        <CreateClientButton />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <ClientsList initialClients={clients} />
      </div>
    </div>
  );
}
