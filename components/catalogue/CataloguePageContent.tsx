import { getModels } from '@/lib/actions/models.actions';
import CataloguePageContentClient from './CataloguePageContentClient';

export default async function CataloguePageContent() {
  const models = await getModels();

  return <CataloguePageContentClient initialModels={models || []} />;
}

