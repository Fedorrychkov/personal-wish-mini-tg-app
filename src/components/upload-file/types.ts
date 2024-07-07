import { FileRejection } from 'react-dropzone'

export type FileUploadReqeust = {
  acceptedFiles: File[]
  fileRejections: FileRejection[]
}
