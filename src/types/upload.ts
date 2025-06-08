export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error'

export interface UploadFile {
  file: File
  preview: string
  status: UploadStatus
  progress: number
  error?: string
}
