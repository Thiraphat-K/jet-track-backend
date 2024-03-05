import { Injectable } from '@nestjs/common';
import { LicensePlateService } from 'src/common/license-plate.service';
import { IEventLog } from 'src/interface/common.interface';

@Injectable()
export class HistoryService {
  constructor(private readonly licensePlateService: LicensePlateService) {}
  async getAllData(info: IEventLog) {
    return await this.licensePlateService.getAllLicenses(info);
  }
}
