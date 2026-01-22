import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class SpacesService {
  private readonly s3: S3Client;

  private readonly bucket = process.env.DO_SPACES_BUCKET!;
  public readonly cdnBase = process.env.DO_SPACES_CDN!;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.DO_SPACES_REGION,
      endpoint: process.env.DO_SPACES_ENDPOINT,
      credentials: {
        accessKeyId: process.env.DO_SPACES_KEY!,
        secretAccessKey: process.env.DO_SPACES_SECRET!,
      },
    });
  }

  async putPublicObject(params: {
    key: string;
    body: Buffer;
    contentType: string;
  }): Promise<{ key: string; url: string }> {
    const { key, body, contentType } = params;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ACL: 'public-read',
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );

    return {
      key,
      url: `${this.cdnBase}/${key}`,
    };
  }
}