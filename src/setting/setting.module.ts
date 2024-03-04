import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { UserService } from 'src/common/user.service';
import { CameraService } from 'src/common/camera.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/guard/role.guard';

@Module({
  controllers: [SettingController],
  providers: [
    SettingService,
    UserService,
    CameraService,
    PrismaService,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class SettingModule {}
