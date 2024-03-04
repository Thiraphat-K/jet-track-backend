import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { cameras } from '@prisma/client';
import { ICamera, ICameraIU } from 'src/interface/cameras.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CameraService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCamera(cameraData: ICamera): Promise<cameras> {
    if (!cameraData)
      throw new NotAcceptableException({
        message: 'Please enter url ip-camera again.',
      });
    const existed = await this.getCameraByIU({ rtsp_url: cameraData.rtsp_url });
    if (existed) return existed;
    const camera = await this.prismaService.cameras.create({
      data: {
        rtspUrl: cameraData.rtsp_url,
        // users: { connect: { id: cameraData.user_id } },
      },
      // include: { users: { select: { id: true } } },
    });
    if (!camera)
      throw new BadRequestException({ message: 'Failed to create ip-camera.' });
    return camera;
  }

  async getCameraByIU(cameraIU: ICameraIU): Promise<cameras> {
    let camera: cameras;
    if (cameraIU.id !== (null || undefined))
      camera = (await this.prismaService.cameras.findFirst({
        where: { id: cameraIU.id },
        // include: { users: { select: { id: true } } },
      })) as cameras;
    else
      camera = (await this.prismaService.cameras.findUnique({
        where: {
          rtspUrl: cameraIU.rtsp_url,
        },
        // include: { users: { select: { id: true } } },
      })) as cameras;
    return camera;
  }
}
