import { useState } from 'react'
import { UploadFile } from '@/types/upload'

export function useUpload() {
  const [files, setFiles] = useState<UploadFile[]>([])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles) return

    const newFiles: UploadFile[] = Array.from(selectedFiles).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
      progress: 0,
    }))

    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  return {
    files,
    handleFileSelect,
    removeFile,
  }
}
