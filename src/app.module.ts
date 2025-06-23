import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import TransformInterceptor from './core/interceptors/transform.interceptor';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VideosModule } from './modules/videos/videos.module';
import { CommentsModule } from './modules/comments/comments.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { PlaylistModule } from './modules/playlist/playlist.module';
import { LikesModule } from './modules/likes/likes.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChannelsModule } from './modules/channels/channels.module';
import { SearchModule } from './modules/search/search.module';
import { AdminModule } from './modules/admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    UsersModule,
    VideosModule,
    CommentsModule,
    SubscriptionsModule,
    PlaylistModule,
    LikesModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
    }),
    ChannelsModule,
    SearchModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppService,
  ],
})
export class AppModule {}
