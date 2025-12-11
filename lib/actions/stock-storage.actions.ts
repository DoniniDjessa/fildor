'use server';

import { uploadImage } from '@/lib/storage/images';

export async function uploadStockItemPhoto(formData: FormData): Promise<string> {
  const file = formData.get('file') as File;
  const stockItemId = formData.get('stockItemId') as string;
  
  if (!file || !stockItemId) {
    throw new Error('File and stockItemId are required');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${stockItemId}.${fileExt}`;
  const path = `stock/${fileName}`;
  
  return await uploadImage(file, path);
}

