import { Injectable } from '@nestjs/common';
import { cars } from '@prisma/client';
import { ICar } from 'src/interface/cars.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CameraService } from './camera.service';

@Injectable()
export class CarService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cameraService: CameraService,
  ) {}

  async createCar(carData: ICar): Promise<cars> {
    const camera = await this.cameraService.createCamera({
      rtsp_url: carData.rtsp_url,
    });
    const _date_time: Date = new Date(Date.parse(`${carData.date_time}+0000`));
    const car = await this.prismaService.cars.create({
      data: {
        carBrand: carData.car_brand,
        carImgUrl: carData.car_img_url,
        lpId: carData.lp_id,
        cameraId: camera.id,
        dateTime: _date_time,
      },
    });
    return car;
  }
}
