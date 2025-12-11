'use server';

import { uploadImage } from '@/lib/storage/images';

/**
 * Clean filename to remove special characters that are invalid for Supabase Storage
 */
function cleanFileName(fileName: string): string {
  // Get file extension
  const extension = fileName.split('.').pop() || '';
  // Get filename without extension
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
  
  // Replace spaces and special characters with underscores
  // Keep only alphanumeric, underscores, hyphens, and dots
  const cleaned = nameWithoutExt
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^a-zA-Z0-9._-]/g, '') // Remove special characters
    .toLowerCase(); // Convert to lowercase
  
  return `${cleaned}.${extension}`;
}

export async function uploadOrderImage(formData: FormData): Promise<string> {
  const file = formData.get('file') as File;
  const type = formData.get('type') as string; // 'fabric', 'reference', 'sketch'
  const orderId = formData.get('orderId') as string;

  if (!file || !type || !orderId) {
    throw new Error('Missing required fields');
  }

  // Clean the filename to remove special characters
  const cleanedFileName = cleanFileName(file.name);
  
  // Determine storage path based on type
  const path = `orders/${orderId}/${type}/${Date.now()}-${cleanedFileName}`;

  const imageUrl = await uploadImage(file, path);
  return imageUrl;
}

