import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cars } from '@prisma/client';
import { CarService } from 'src/common/car.service';
import { LicensePlateService } from 'src/common/license-plate.service';
import { ICar } from 'src/interface/cars.interface';
import { IDataRealtime, IEventRealtime } from 'src/interface/common.interface';
import { ILicense } from 'src/interface/license-plates.interface';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class RealTimeService {
  constructor(
    private readonly configService: ConfigService,
    private readonly carService: CarService,
    private readonly licenseService: LicensePlateService,
    private readonly minioClientService: MinioClientService,
    private readonly websocketGateway: SocketGateway,
  ) {}
  async dataRealtime(body: any): Promise<IEventRealtime | null> {
    const jsonData = await this.minioClientService.getJsonData(body);
    if (!jsonData || jsonData == undefined)
      throw new InternalServerErrorException({
        message: 'The JSON data could not be parsed.',
      });
    const {
      rtsp_url,
      img_car_path,
      brand,
      date_time,
      img_license_path,
      license_plate,
      province,
    } = jsonData;
    const rtsp_ip = rtsp_url?.split('/')[2].split(':')[0] as string;
    const wrapDatetime = new Date(date_time);
    wrapDatetime.setHours(wrapDatetime.getHours() + 7);
    const dateTimez = wrapDatetime
      .toISOString()
      .replace('Z', '') as IDataRealtime['date_time'];
    const lp_img_url = `${await this.configService.get<string>('minio-api')}/${img_license_path}`;
    const lpData = {
      lp_number: license_plate,
      province,
      lp_img_url,
    } as ILicense;
    const lp = await this.licenseService.createLicensePlate(lpData);

    const car_img_url = `${await this.configService.get<string>('minio-api')}/${img_car_path}`;
    const carData = {
      rtsp_ip,
      car_img_url,
      car_brand: brand,
      date_time: dateTimez,
    } as ICar;
    let car: cars;
    try {
      car = await this.carService.createCar({ ...carData, lp_id: lp.id });
    } catch {
      throw new ForbiddenException({ message: 'Cannot create car.' });
    }
    const res = {
      id: car.id,
      rtsp_ip,
      brand,
      car_img_url,
      date_time: dateTimez,
      lp_number: license_plate!,
      lp_img_url,
      province,
    };
    await this.websocketGateway.handleMessage(res);
    return res;
  }
}
