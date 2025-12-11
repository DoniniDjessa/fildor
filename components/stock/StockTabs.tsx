import { getStockItemsByCategory } from '@/lib/actions/stock-items.actions';
import { getMaterialTypes } from '@/lib/actions/material-types.actions';
import { getCurrentUser } from '@/lib/auth/actions';
import StockTabsClient from './StockTabsClient';

export default async function StockTabs() {
  const [fabricsItems, mercerieItems, materialTypes, currentUser] = await Promise.all([
    getStockItemsByCategory('Tissu'),
    getStockItemsByCategory('Mercerie'),
    getMaterialTypes(),
    getCurrentUser(),
  ]);

  const isAdmin = currentUser?.profile?.role === 'superAdmin' || currentUser?.profile?.role === 'admin';

  return (
    <StockTabsClient
      fabricsItems={fabricsItems}
      mercerieItems={mercerieItems}
      materialTypes={materialTypes}
      isAdmin={!!isAdmin}
    />
  );
}

