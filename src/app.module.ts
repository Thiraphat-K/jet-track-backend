import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RealTimeModule } from './real-time/real-time.module';
import { AuthModule } from './auth/auth.module';
import { HistoryModule } from './history/history.module';
import { SettingModule } from './setting/setting.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { CommonModule } from './common/common.module';
import configuration from 'config/configuration';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './filter/httpException.filter';
import { AuthGuard } from './guard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { MinioClientModule } from './minio-client/minio-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      load: [configuration],
    }),
    RealTimeModule,
    AuthModule,
    HistoryModule,
    SettingModule,
    CommonModule,
    MinioClientModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    JwtService,
  ],
  exports: [],
})
export class AppModule {}
