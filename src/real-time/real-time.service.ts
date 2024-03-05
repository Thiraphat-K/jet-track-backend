import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cameras } from '@prisma/client';
import { CameraService } from 'src/common/camera.service';
import { CarService } from 'src/common/car.service';
import { LicensePlateService } from 'src/common/license-plate.service';
import { UserService } from 'src/common/user.service';
import { ICamera } from 'src/interface/cameras.interface';
import { ICar } from 'src/interface/cars.interface';
import { IEventRealtime } from 'src/interface/common.interface';
import { ILicense } from 'src/interface/license-plates.interface';
import { MinioClientService } from 'src/minio-client/minio-client.service';

@Injectable()
export class RealTimeService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly cameraService: CameraService,
    private readonly carService: CarService,
    private readonly licenseService: LicensePlateService,
    private readonly minioClientService: MinioClientService,
  ) {}
  async connectCamera(inputData: ICamera) {
    let camera: cameras;
    const existed = await this.cameraService.getCameraByIU({
      rtsp_url: inputData.rtsp_url,
    });
    if (existed) camera = existed;
    else camera = await this.cameraService.createCamera(inputData);
    if (!camera)
      throw new BadRequestException({ message: 'Can not connect ip-camera.' });
    await this.userService.updateUser(inputData.user_id!, {
      camera_id: camera.id,
    });
    return camera;
  }

  async dataRealtime(body: any): Promise<IEventRealtime | null> {
    const jsonData = await this.minioClientService.getJsonData(body);
    const {
      rtsp_url,
      img_car_path,
      brand,
      date_time,
      img_license_path,
      license_plate,
      province,
    } = jsonData;
    const lp_img_url = `${await this.configService.get<string>('minio-api')}/${img_license_path}`;
    const lpData = {
      lp_number: license_plate,
      province,
      lp_img_url,
    } as ILicense;
    const lp = await this.licenseService.createLicensePlate(lpData);

    const car_img_url = `${await this.configService.get<string>('minio-api')}/${img_car_path}`;
    const carData = {
      rtsp_url,
      car_img_url,
      car_brand: brand,
      date_time,
    } as ICar;
    const car = await this.carService.createCar({ ...carData, lp_id: lp.id });
    if (!car) throw new ForbiddenException({ message: 'Cannot create car.' });
    return {
      rtsp_url,
      brand,
      car_img_url,
      date_time,
      lp_number: license_plate!,
      lp_img_url,
      province,
    };
  }
}
