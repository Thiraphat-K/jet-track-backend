import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CameraService } from './camera.service';
import { CarService } from './car.service';
import { LicensePlateService } from './license-plate.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    UserService,
    CameraService,
    CarService,
    LicensePlateService,
    PrismaService,
    ConfigService,
  ],
})
export class CommonModule {}
