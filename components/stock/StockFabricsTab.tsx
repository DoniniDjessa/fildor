import { getStockItemsByCategory } from '@/lib/actions/stock-items.actions';
import StockFabricsTabClient from './StockFabricsTabClient';

export default async function StockFabricsTab() {
  const stockItems = await getStockItemsByCategory('Tissu');

  return <StockFabricsTabClient initialStockItems={stockItems} />;
}

