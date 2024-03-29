import { Module } from '@nestjs/common';
import { RealTimeController } from './real-time.controller';
import { RealTimeService } from './real-time.service';
import { CameraService } from 'src/common/camera.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/guard/role.guard';
import { CarService } from 'src/common/car.service';
import { LicensePlateService } from 'src/common/license-plate.service';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [MinioClientModule, SocketModule],
  controllers: [RealTimeController],
  providers: [
    PrismaService,
    ConfigService,
    RealTimeService,
    CameraService,
    CarService,
    LicensePlateService,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class RealTimeModule {}
