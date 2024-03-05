import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/guard/role.guard';
import { CameraService } from 'src/common/camera.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CarService } from 'src/common/car.service';
import { LicensePlateService } from 'src/common/license-plate.service';

@Module({
  controllers: [HistoryController],
  providers: [
    HistoryService,
    PrismaService,
    CarService,
    CameraService,
    LicensePlateService,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class HistoryModule {}
