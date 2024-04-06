import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { cameras } from '@prisma/client';
import { ICameraCars, ICameraIU } from 'src/interface/cameras.interface';
import { IEventLog } from 'src/interface/common.interface';
import { IUserIU } from 'src/interface/user.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CameraService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCamera(cameraIU: ICameraIU): Promise<cameras> {
    if (!cameraIU)
      throw new NotAcceptableException({
        message: 'Please enter ip-camera address again.',
      });
    const existed = await this.getCameraByIU({ rtsp_ip: cameraIU.rtsp_ip });
    if (existed) return existed;
    const camera = await this.prismaService.cameras.create({
      data: {
        rtspUrl: `rtsp://${cameraIU.rtsp_ip}:1200/live`,
      },
    });
    if (!camera)
      throw new BadRequestException({ message: 'Failed to create ip-camera.' });
    return camera;
  }

  async getCameraByIU(cameraIU: ICameraIU): Promise<cameras> {
    let camera: cameras;
    if (cameraIU.id !== undefined)
      camera = (await this.prismaService.cameras.findUnique({
        where: { id: cameraIU.id },
      })) as cameras;
    else
      camera = (await this.prismaService.cameras.findUnique({
        where: {
          rtspUrl: `rtsp://${cameraIU.rtsp_ip}:1200/live`,
        },
      })) as cameras;
    return camera;
  }

  async getAllUsers(
    cameraIU: ICameraIU,
  ): Promise<cameras & { users: IUserIU[] }> {
    const rtspIp = cameraIU.rtsp_ip;
    const camera = await this.prismaService.cameras.findFirst({
      where: { rtspUrl: { contains: rtspIp } },
      include: { users: { select: { username: true } } },
    });
    return camera!;
  }

  // Not available, use car service instead.
  async getAllData(eventLog: IEventLog): Promise<ICameraCars | null> {
    const _camera = await this.prismaService.cameras.findFirst({
      where: {
        rtspUrl: `rtsp://${eventLog.rtsp_ip}:1200/live`,
      },
      select: {
        rtspUrl: true,
        cars: {
          where: {
            license_plates: {
              lpNumber: { contains: eventLog.lpNumber },
              province: { contains: eventLog.province },
            },
            carBrand: { contains: eventLog.brand },
            dateTime: {
              gte: eventLog.startDateTime,
              lte: eventLog.endDateTime,
            },
          },
          select: {
            id: true,
            dateTime: true,
            license_plates: {
              select: { lpImgUrl: true, lpNumber: true, province: true },
            },
            carBrand: true,
            carImgUrl: true,
          },
          orderBy: { dateTime: 'desc' },
        },
      },
    });
    const camera = Object.keys(_camera!).reduce((acc, key) => {
      if (key === 'rtspUrl') acc['rtspIp'] = eventLog.rtsp_ip;
      else acc[key] = _camera![key];
      return acc;
    }, {}) as ICameraCars;
    console.log(camera.cars.length);
    return camera;
  }
}
