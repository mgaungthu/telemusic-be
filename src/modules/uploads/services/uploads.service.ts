import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { audioTranscodeQueue } from '@/queues/audio-transcode.queue';

@Injectable()
export class UploadsService {
  constructor() {}

  async uploadAudioAndQueue(file: Express.Multer.File, trackId: bigint) {
    const uploadDir = '/tmp/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const originalPath = path.join(
      uploadDir,
      `${trackId}-${Date.now()}-${file.originalname}`,
    );

    fs.writeFileSync(originalPath, file.buffer);

    const outputDir = path.join('/tmp/transcoded', String(trackId));

    const job = await audioTranscodeQueue.add(
      'audio-transcode',
      {
        inputPath: originalPath,
        outputDir,
        trackId: trackId.toString(), // BigInt-safe
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 3000 },
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return {
      trackId,
      jobId: job.id,
      status: 'queued',
      next: `/api/tracks/${trackId}/progress`,
    };
  }
}
