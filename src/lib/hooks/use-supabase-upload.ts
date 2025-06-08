import { useState } from 'react'
import { uploadFile, deleteFile } from '../supabase'
import { toast } from 'sonner'

interface UploadResult {
  url: string
  key: string
  name: string
  size: number
}

interface UseUploadProps {
  onUploadComplete?: (res: UploadResult[]) => void
  onUploadError?: (error: Error) => void
}

export function useSupabaseUpload({ onUploadComplete, onUploadError }: UseUploadProps = {}) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const startUpload = async (files: File[], bucket: string = 'heliix-files') => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const results: UploadResult[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const folder = file.type.startsWith('image/') ? 'images' : 'documents'
        
        // Update progress
        setUploadProgress(Math.round(((i + 0.5) / files.length) * 100))
        
        const { url, error } = await uploadFile(file, bucket, folder)
        
        if (error) {
          throw error
        }
        
        if (url) {
          results.push({
            url,
            key: url,
            name: file.name,
            size: file.size
          })
        }
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100))
      }

      onUploadComplete?.(results)
      toast.success(`Successfully uploaded ${results.length} file(s)`, {
        description: results.map(r => r.name).join(', '),
        action: {
          label: "View",
          onClick: () => console.log("View uploaded files", results),
        },
      })
      
      return results
    } catch (error) {
      const err = error as Error
      console.error('Upload error:', err)
      onUploadError?.(err)
      toast.error('Upload failed', {
        description: err.message,
        action: {
          label: "Try again",
          onClick: () => startUpload(files, bucket),
        },
      })
      throw err
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const deleteFiles = async (urls: string[], bucket: string = 'heliix-files') => {
    const errors: Error[] = []
    
    for (const url of urls) {
      const { error } = await deleteFile(url, bucket)
      if (error) {
        errors.push(error)
      }
    }
    
    if (errors.length > 0) {
      toast.error(`Failed to delete ${errors.length} file(s)`)
    } else {
      toast.success('Files deleted successfully')
    }
    
    return errors
  }

  return {
    startUpload,
    deleteFiles,
    isUploading,
    uploadProgress
  }
}