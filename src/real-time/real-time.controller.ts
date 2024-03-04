import { Controller } from '@nestjs/common';
import { RealTimeService } from './real-time.service';
import { TypedBody, TypedRoute } from '@nestia/core';
import { User } from 'src/decorator/user.decorator';
import { tags } from 'typia';
import { Public } from 'src/decorator/public.decorator';
import { Minio } from 'src/decorator/minio.decorator';

@Controller('real-time')
export class RealTimeController {
  constructor(private readonly realtimeService: RealTimeService) {}

  @TypedRoute.Post('connect-camera')
  async realtimeConnectCamera(
    @User('sub') userId: string & tags.Format<'uuid'>,
    @TypedBody() input: { rtsp_url: string },
  ) {
    return await this.realtimeService.connectCamera({
      ...input,
      user_id: userId,
    });
  }

  @Public()
  @TypedRoute.Post('data-realtime')
  async realtimeData(@Minio('body') req: any) {
    return await this.realtimeService.dataRealtime(req);
  }
}
