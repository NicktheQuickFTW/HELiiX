import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Helper function to upload files to Supabase Storage
export async function uploadFile(
  file: File,
  bucket: string,
  folder: string
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (error) {
      return { url: null, error }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return { url: publicUrl, error: null }
  } catch (error) {
    return { url: null, error: error as Error }
  }
}

// Helper function to delete files from Supabase Storage
export async function deleteFile(
  fileUrl: string,
  bucket: string
): Promise<{ error: Error | null }> {
  try {
    // Extract file path from URL
    const url = new URL(fileUrl)
    const filePath = url.pathname.split(`/storage/v1/object/public/${bucket}/`)[1]

    if (!filePath) {
      return { error: new Error('Invalid file URL') }
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    return { error }
  } catch (error) {
    return { error: error as Error }
  }
}