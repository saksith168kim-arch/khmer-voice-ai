import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { nanoid } from 'nanoid'

// Support both AWS S3 and Cloudflare R2
const isR2 = !!process.env.R2_ACCOUNT_ID

const s3Client = new S3Client(
  isR2
    ? {
        region: 'auto',
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
      }
    : {
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
      }
)

const BUCKET = isR2
  ? process.env.R2_BUCKET || 'khmer-voice-ai-audio'
  : process.env.AWS_S3_BUCKET || 'khmer-voice-ai-audio'

export interface UploadResult {
  key: string
  url: string
  size: number
}

export async function uploadAudio(
  buffer: Buffer,
  userId: string,
  format: 'mp3' | 'wav' = 'mp3'
): Promise<UploadResult> {
  const key = `audio/${userId}/${nanoid()}.${format}`
  const contentType = format === 'mp3' ? 'audio/mpeg' : 'audio/wav'

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      // Set cache headers for better CDN performance
      CacheControl: 'public, max-age=31536000',
      Metadata: {
        userId,
        createdAt: new Date().toISOString(),
      },
    })
  )

  // Use public R2 URL or generate signed S3 URL
  let url: string
  if (isR2 && process.env.R2_PUBLIC_URL) {
    url = `${process.env.R2_PUBLIC_URL}/${key}`
  } else {
    url = await getSignedAudioUrl(key)
  }

  return { key, url, size: buffer.length }
}

export async function getSignedAudioUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key })
  return await getSignedUrl(s3Client, command, { expiresIn })
}

export async function deleteAudio(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  )
}

export async function getPublicUrl(key: string): Promise<string> {
  if (isR2 && process.env.R2_PUBLIC_URL) {
    return `${process.env.R2_PUBLIC_URL}/${key}`
  }
  // For S3, return a signed URL
  return getSignedAudioUrl(key, 86400) // 24 hours
}
