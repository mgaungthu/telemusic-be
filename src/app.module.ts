import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { IdentityModule } from './modules/identity/identity.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { TracksModule } from './modules/tracks/tracks.module';

import { EngagementModule } from './modules/engagement/engagement.module';
import { PlaylistModule } from './modules/playlists/playlist.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { MonetizationModule } from './modules/monetization/monetization.module';
import { KycModule } from './modules/kyc/kyc.module';
import { SettingsModule } from './modules/settings/settings.module';

import { PrismaModule } from '@/common/prisma/prisma.module';
import { PrismaRequestMiddleware } from '@/common/middleware/prisma-request.middleware';
import { LoggingModule } from '@/common/logging/logging.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LookupsModule } from './modules/lookups/lookups.module';
import { AdminUsersModule } from './modules/admin/admin-users.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'redis',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    PrismaModule,
    IdentityModule,
    ArtistsModule,
    AlbumsModule,
    TracksModule,
    PlaylistModule,
    LoggingModule,
    EngagementModule,
    AnalyticsModule,
    MonetizationModule,
    KycModule,
    LookupsModule,
    AdminUsersModule,
    UploadsModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrismaRequestMiddleware).forRoutes('*')
  }
}
