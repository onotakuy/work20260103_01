import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME || ''

export async function uploadToR2(key: string, file: File | Buffer, contentType: string) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
    
    await r2Client.send(command)
    return true
  } catch (error) {
    console.error('R2へのアップロードエラー:', error)
    return false
  }
}

export async function getFromR2(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    
    const response = await r2Client.send(command)
    return response.Body
  } catch (error) {
    console.error('R2からの取得エラー:', error)
    return null
  }
}

export function getR2PublicUrl(key: string) {
  const publicUrl = process.env.R2_PUBLIC_URL || ''
  return `${publicUrl}/${key}`
}
