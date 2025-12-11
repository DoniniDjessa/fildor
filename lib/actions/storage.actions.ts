'use server';

import { uploadImage } from '@/lib/storage/images';

export async function uploadClientPhoto(formData: FormData): Promise<string> {
  const file = formData.get('file') as File;
  const clientId = formData.get('clientId') as string;
  
  if (!file || !clientId) {
    throw new Error('File and clientId are required');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${clientId}.${fileExt}`;
  const path = `clients/${fileName}`;
  
  return await uploadImage(file, path);
}

