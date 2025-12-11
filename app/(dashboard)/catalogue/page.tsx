import { getModels } from '@/lib/actions/models.actions';
import CataloguePageContentClient from '@/components/catalogue/CataloguePageContentClient';

export default async function CataloguePage() {
  const models = await getModels();

  return <CataloguePageContentClient initialModels={models} />;
}

