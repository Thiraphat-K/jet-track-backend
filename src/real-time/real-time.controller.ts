import { Controller } from '@nestjs/common';
import { RealTimeService } from './real-time.service';
import { TypedRoute } from '@nestia/core';
import { Public } from 'src/decorator/public.decorator';
import { Minio } from 'src/decorator/minio.decorator';

@Controller('real-time')
export class RealTimeController {
  constructor(private readonly realtimeService: RealTimeService) {}

  @Public()
  @TypedRoute.Post('data-realtime')
  async realtimeData(@Minio('body') req: any) {
    return await this.realtimeService.dataRealtime(req);
  }
}
