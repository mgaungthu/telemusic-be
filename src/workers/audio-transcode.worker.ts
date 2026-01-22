import { Worker } from 'bullmq';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';

console.log('🎧 Audio Transcode Worker starting...');

ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');
ffmpeg.setFfprobePath('/usr/bin/ffprobe');

const prisma = new PrismaClient();

const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION || 'sgp1',
  endpoint: process.env.DO_SPACES_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});
const SPACES_BUCKET = process.env.DO_SPACES_BUCKET!;
const SPACES_PUBLIC_URL = process.env.DO_SPACES_CDN!; // e.g. https://your-space.sgp1.cdn.digitaloceanspaces.com

/**
 * Job data shape (API side must match this)
 */
interface AudioTranscodeJob {
  inputPath: string;        // local temp file path
  outputDir: string;        // temp output directory
  trackId: string;          // BigInt-safe (string)
}

/**
 * Helper: ensure directory exists
 */
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Helper: extract duration (seconds)
 */
function getDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      resolve(Math.floor(metadata.format.duration || 0));
    });
  });
}

/**
 * Helper: transcode to FLAC
 */
function transcodeToFlac(input: string, output: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .audioCodec('flac')
      .audioChannels(2)
      .audioFrequency(44100)
      .on('end', () => resolve())
      .on('error', err => reject(err))
      .save(output);
  });
}

/**
 * Helper: transcode to AAC (m4a)
 */
function transcodeToAac(input: string, output: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .audioCodec('aac')
      .audioBitrate('256k')
      .audioChannels(2)
      .audioFrequency(44100)
      .on('end', () => resolve())
      .on('error', err => reject(err))
      .save(output);
  });
}

/**
 * Helper: upload file to DigitalOcean Spaces
 */
async function uploadToSpaces(localPath: string, key: string, contentType: string) {
  console.log(`⬆️ Uploading ${key} (${fs.statSync(localPath).size} bytes)`);

  const body = fs.readFileSync(localPath);

  await s3.send(
    new PutObjectCommand({
      Bucket: SPACES_BUCKET,
      Key: key,
      Body: body,
      ACL: 'public-read',
      ContentType: contentType,
    }),
  );

  console.log(`⬆️ Upload finished: ${key}`);

  return `${SPACES_PUBLIC_URL}/${key}`;
}

/**
 * BullMQ Worker
 */
const worker = new Worker<AudioTranscodeJob>(
  'audio-transcode',
  async job => {
    const { inputPath, outputDir } = job.data;
    const trackId = BigInt(job.data.trackId);

    console.log(`🎶 [Job ${job.id}] Start transcoding track ${trackId}`);
    await job.updateProgress(5);

    ensureDir(outputDir);

    const flacPath = path.join(outputDir, 'track.flac');
    const aacPath = path.join(outputDir, 'track.m4a');

    // 1️⃣ Extract duration
    const duration = await getDuration(inputPath);
    console.log(`⏱ Duration: ${duration}s`);
    await job.updateProgress(15);

    // 2️⃣ Transcode formats
    await transcodeToFlac(inputPath, flacPath);
    console.log('✅ FLAC generated');
    await job.updateProgress(30);

    await transcodeToAac(inputPath, aacPath);
    console.log('✅ AAC generated');
    await job.updateProgress(50);

    const flacKey = `audio/${trackId}/track.flac`;
    const aacKey = `audio/${trackId}/track.m4a`;

    const flacUrl = await uploadToSpaces(flacPath, flacKey, 'audio/flac');
    console.log(`☁️ FLAC uploaded: ${flacUrl}`);
    await job.updateProgress(70);

    const aacUrl = await uploadToSpaces(aacPath, aacKey, 'audio/mp4');
    console.log(`☁️ AAC uploaded: ${aacUrl}`);
    await job.updateProgress(85);

    // cleanup local temp files
    try {
      fs.unlinkSync(flacPath);
      fs.unlinkSync(aacPath);
      fs.unlinkSync(inputPath);
      fs.rmSync(outputDir, { recursive: true, force: true });
    } catch {}

    await prisma.track.update({
      where: { id: trackId },
      data: {
        audioUrl: aacUrl,   // primary stream
        duration,
        status: 'published',
      },
    });
    console.log(`📝 Track ${trackId} updated → status=published`);
    await job.updateProgress(95);

    await job.updateProgress(100);
    console.log(`✅ Job ${job.id} completed successfully`);

    return;
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT || 6379),
    },
  },
);


/**
 * Error handling (VERY IMPORTANT – prevents crash loop)
 */
worker.on('error', err => {
  console.error('❌ Worker error:', err);
});

worker.on('failed', async (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
  if (job?.data?.trackId) {
    try {
      await prisma.track.update({
        where: { id: BigInt(job.data.trackId) },
        data: { status: 'rejected' },
      });
    } catch {}
  }
});

process.on('SIGTERM', () => {
  console.log('🛑 Audio Transcode Worker shutting down...');
});