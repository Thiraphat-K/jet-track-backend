import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/guard/role.guard';

@Module({
  controllers: [HistoryController],
  providers: [
    HistoryService,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class HistoryModule {}
