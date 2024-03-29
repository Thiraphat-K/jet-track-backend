import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { cameras } from '@prisma/client';
import { ICameraIU } from 'src/interface/cameras.interface';
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
}
