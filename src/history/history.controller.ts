import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { IEventLog } from 'src/interface/common.interface';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @TypedRoute.Post('events')
  async getAllEvents(@TypedBody() eventLog: IEventLog) {
    return await this.historyService.getAllData(eventLog);
  }
}
