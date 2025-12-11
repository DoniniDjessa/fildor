'use server';

import { createServerClient } from '@/lib/supabase/server';

const BUCKET_NAME = 'fildor-bucket';

/**
 * Upload an image to Supabase Storage
 * @param file - File to upload
 * @param path - Path in the bucket (e.g., 'clients/client-id.jpg')
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  const supabase = await createServerClient();

  // Verify user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('User must be authenticated to upload images');
  }

  // Convert File to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Supabase Storage
  // Note: Make sure RLS policies are configured in Supabase for the path
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
      cacheControl: '3600',
    });

  if (error) {
    // Provide more detailed error message for RLS issues
    if (error.message.includes('row-level security') || error.message.includes('RLS')) {
      throw new Error(`Storage policy error: ${error.message}. Please ensure RLS policies are configured for the '${path.split('/')[0]}' folder in Supabase Storage.`);
    }
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Delete an image from Supabase Storage
 * @param path - Path in the bucket (e.g., 'clients/client-id.jpg')
 */
export async function deleteImage(path: string): Promise<void> {
  const supabase = await createServerClient();

  // Extract the path from a full URL if needed
  const storagePath = path.includes(BUCKET_NAME)
    ? path.split(`${BUCKET_NAME}/`)[1]
    : path;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);

  if (error) {
    console.error('Failed to delete image:', error);
    // Don't throw - image deletion failure shouldn't block the operation
  }
}

/**
 * Extract storage path from a public URL
 * @param url - Public URL from Supabase Storage
 * @returns Storage path (e.g., 'clients/client-id.jpg')
 */
export async function extractStoragePath(url: string): Promise<string | null> {
  try {
    // If it's already a storage path (not a full URL), return as is
    if (!url.includes('http') && !url.includes('://')) {
      return url;
    }
    
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const bucketIndex = pathParts.findIndex((part) => part === BUCKET_NAME);
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      return pathParts.slice(bucketIndex + 1).join('/');
    }
    // Alternative: try to find 'storage/v1/object/public' pattern
    const storageIndex = pathParts.findIndex((part) => part === 'storage');
    if (storageIndex !== -1 && pathParts[storageIndex + 3] === 'public') {
      // Format: /storage/v1/object/public/bucket-name/path
      return pathParts.slice(storageIndex + 4).join('/');
    }
    return null;
  } catch {
    return null;
  }
}

