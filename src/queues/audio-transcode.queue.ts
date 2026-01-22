import { Queue } from 'bullmq';

export const audioTranscodeQueue = new Queue('audio-transcode', {
  connection: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT || 6379),
  },
});