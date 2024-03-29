import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { IEventLog } from 'src/interface/common.interface';
import { HistoryService } from './history.service';
import { tags } from 'typia';
import { User } from 'src/decorator/user.decorator';
import { Public } from 'src/decorator/public.decorator';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}
  @TypedRoute.Post('connect-camera')
  async realtimeConnectCamera(
    @User('sub') userId: string & tags.Format<'uuid'>,
    @TypedBody() input: { rtsp_ip: string },
  ) {
    return await this.historyService.connectCamera({
      ...input,
      user_id: userId,
    });
  }

  @Public()
  @TypedRoute.Post('events')
  async getAllEvents(@TypedBody() eventLog: IEventLog) {
    return await this.historyService.getAllData(eventLog);
  }

  @Public()
  @TypedRoute.Get('car/:id')
  async getCar(@TypedParam('id') carId: string & tags.Format<'uuid'>) {
    return await this.historyService.getCarById({ id: carId });
  }
}
