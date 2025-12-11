import { getStockKPIs } from '@/lib/actions/stock-items.actions';
import StockKPIsClient from './StockKPIsClient';

export default async function StockKPIs() {
  const kpis = await getStockKPIs();

  return <StockKPIsClient kpis={kpis} />;
}

