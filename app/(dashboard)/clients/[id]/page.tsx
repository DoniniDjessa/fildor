import { notFound } from 'next/navigation';
import { getClientById } from '@/lib/actions/clients.actions';
import ClientDetailsView from '@/components/clients/ClientDetailsView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  return <ClientDetailsView client={client} />;
}

