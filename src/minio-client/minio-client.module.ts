import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';
import { MinioClientService } from './minio-client.service';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          endPoint: configService.get<string>('minio-endpoint') as string,
          port: 1 * configService.get<number>('minio-api-port')!,
          useSSL: false,
          accessKey: configService.get<string>('minio-access_key') as string,
          secretKey: configService.get<string>('minio-secret_key') as string,
        };
      },
    }),
  ],
  providers: [MinioClientService, ConfigService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
