import { Injectable, NotFoundException } from '@nestjs/common';
import { cars } from '@prisma/client';
import { ICar, ICarU, ICars } from 'src/interface/cars.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CameraService } from './camera.service';
import { IEventLog } from 'src/interface/common.interface';

@Injectable()
export class CarService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cameraService: CameraService,
  ) {}

  async createCar(carData: ICar): Promise<cars> {
    const camera = await this.cameraService.createCamera({
      rtsp_ip: carData.rtsp_ip,
    });
    const _date_time: Date = new Date(Date.parse(carData.date_time));
    // console.log(_date_time);
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

  async getCarByIU(carIU: ICarU): Promise<ICars> {
    const car = await this.prismaService.cars.findUnique({
      where: {
        id: carIU.id,
      },
      include: {
        license_plates: {
          select: {
            lpNumber: true,
            province: true,
            lpImgUrl: true,
          },
        },
      },
    });
    if (!car) throw new NotFoundException({ message: 'Car not found.' });
    const cameraUrl = await this.prismaService.cars.findUnique({
      where: {
        id: carIU.id,
      },
      select: {
        camera: {
          select: {
            rtspUrl: true,
          },
        },
      },
    });
    const rtspIp = cameraUrl?.camera.rtspUrl
      .split('/')[2]
      .split(':')[0] as string;
    return { ...car, rtspIp: rtspIp };
  }

  async getAllCars(eventLog: IEventLog): Promise<ICars[]> {
    console.log(eventLog);
    const _cars = await this.prismaService.cars.findMany({
      where: {
        camera: { rtspUrl: { contains: eventLog.rtsp_ip } },
        dateTime: {
          gte: eventLog.start_date_time,
          lte: eventLog.end_date_time,
        },
        license_plates: {
          lpNumber: { contains: eventLog.license_plate },
          province: { contains: eventLog.province },
        },
        carBrand: { contains: eventLog.brand },
      },
      include: {
        license_plates: {
          select: {
            lpNumber: true,
            province: true,
            lpImgUrl: true,
          },
        },
      },
      orderBy: { dateTime: 'desc' },
    });
    const mergeData = _cars.map((car) => ({
      ...car,
      rtspIp: eventLog.rtsp_ip,
    }));
    console.log(mergeData.length);
    return mergeData;
  }
}
