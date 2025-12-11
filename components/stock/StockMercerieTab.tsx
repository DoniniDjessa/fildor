import { getStockItemsByCategory } from '@/lib/actions/stock-items.actions';
import StockMercerieTabClient from './StockMercerieTabClient';

export default async function StockMercerieTab() {
  const stockItems = await getStockItemsByCategory('Mercerie');

  return <StockMercerieTabClient initialStockItems={stockItems} />;
}

