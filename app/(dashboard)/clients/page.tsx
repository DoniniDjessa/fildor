import { getClients } from '@/lib/actions/clients.actions';
import ClientsGrid from '@/components/clients/ClientsGrid';

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <ClientsGrid initialClients={clients} />
      </div>
    </div>
  );
}
