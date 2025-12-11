-- Storage Policies for Fil d'Or
-- Bucket: fildor-bucket
-- This file contains the RLS policies needed for uploading order images

-- IMPORTANT: Execute these policies in the Supabase SQL Editor
-- Make sure you're in the correct database and have the right permissions

-- First, drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated users to upload order images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to read order images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update order images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete order images" ON storage.objects;

-- Policy to allow authenticated users to upload images in the orders folder
-- This policy allows uploads to orders/ and all subdirectories (orders/*/*)
-- The storage.foldername(name)[1] function gets the first folder in the path
CREATE POLICY "Allow authenticated users to upload order images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'fildor-bucket' 
  AND (storage.foldername(name))[1] = 'orders'
);

-- Policy to allow authenticated users to read order images
-- Also allow public read access if bucket is public
CREATE POLICY "Allow authenticated users to read order images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'fildor-bucket' 
  AND (storage.foldername(name))[1] = 'orders'
);

-- Policy to allow public read access (if bucket is public)
-- This allows images to be displayed in the browser
CREATE POLICY "Allow public read access to order images"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'fildor-bucket' 
  AND (storage.foldername(name))[1] = 'orders'
);

-- Policy to allow authenticated users to update order images
CREATE POLICY "Allow authenticated users to update order images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'fildor-bucket' 
  AND (storage.foldername(name))[1] = 'orders'
)
WITH CHECK (
  bucket_id = 'fildor-bucket' 
  AND (storage.foldername(name))[1] = 'orders'
);

-- Policy to allow authenticated users to delete order images
CREATE POLICY "Allow authenticated users to delete order images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'fildor-bucket' 
  AND (storage.foldername(name))[1] = 'orders'
);

-- Alternative: If the above doesn't work, try this more permissive policy
-- (Use only if the above policies don't work)
-- CREATE POLICY "Allow authenticated users to upload to orders folder"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'fildor-bucket' 
--   AND name LIKE 'orders/%'
-- );

