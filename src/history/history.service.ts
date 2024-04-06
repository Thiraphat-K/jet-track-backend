import { BadRequestException, Injectable } from '@nestjs/common';
import { cameras } from '@prisma/client';
import { CameraService } from 'src/common/camera.service';
import { CarService } from 'src/common/car.service';
import { UserService } from 'src/common/user.service';
import { ICameraIU } from 'src/interface/cameras.interface';
import { ICarU } from 'src/interface/cars.interface';
import { IEventLog } from 'src/interface/common.interface';

@Injectable()
export class HistoryService {
  constructor(
    private readonly userService: UserService,
    private readonly carService: CarService,
    private readonly cameraService: CameraService,
  ) {}
  async connectCamera(cameraIU: ICameraIU) {
    let camera: cameras;
    const existed = await this.cameraService.getCameraByIU({
      rtsp_ip: cameraIU.rtsp_ip,
    });
    if (existed) camera = existed;
    else camera = await this.cameraService.createCamera(cameraIU);
    if (!camera)
      throw new BadRequestException({ message: 'Can not connect ip-camera.' });
    await this.userService.updateUser(cameraIU.user_id!, {
      camera_id: camera.id,
    });
    return camera;
  }

  async getAllData(eventLog: IEventLog) {
    // return await this.cameraService.getAllData(eventLog);
    return await this.carService.getAllCars(eventLog);
  }

  async getCarById(carU: ICarU) {
    return await this.carService.getCarByIU({ id: carU.id });
  }
}
