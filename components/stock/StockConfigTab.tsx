import { getMaterialTypes } from '@/lib/actions/material-types.actions';
import MaterialTypesList from './MaterialTypesList';

export default async function StockConfigTab() {
  const materialTypes = await getMaterialTypes();

  return <MaterialTypesList initialMaterialTypes={materialTypes} />;
}

