import { Injectable } from '@nestjs/common';
import { license_plates } from '@prisma/client';
import { IEventLog } from 'src/interface/common.interface';
import { ILicense, ILicenseIU } from 'src/interface/license-plates.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LicensePlateService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLicensePlate(lpData: ILicense): Promise<license_plates> {
    const existed = await this.getLicenceByIU({ lp_number: lpData.lp_number });
    console.log(existed);
    if (existed) return existed;
    const lp = await this.prismaService.license_plates.create({
      data: {
        lpNumber: lpData.lp_number,
        province: lpData.province,
        lpImgUrl: lpData.lp_img_url,
      },
    });
    return lp;
  }

  async getLicenceByIU(licenseIU: ILicenseIU): Promise<license_plates> {
    let lp: license_plates;
    if (licenseIU.id !== undefined) {
      lp = (await this.prismaService.license_plates.findFirst({
        where: { id: licenseIU.id },
      })) as license_plates;
    } else {
      lp = (await this.prismaService.license_plates.findUnique({
        where: {
          lpNumber: licenseIU.lp_number,
        },
      })) as license_plates;
    }
    return lp;
  }

  async getAllLicenses(eventLog: IEventLog): Promise<any[]> {
    const start_dateTime = !undefined
      ? new Date(Date.parse(`${eventLog.start_date_time}+0000`))
      : undefined;
    const end_dateTime = !undefined
      ? new Date(Date.parse(`${eventLog.end_date_time}+0000`))
      : undefined;
    console.log('start-date:', start_dateTime, 'end-date:', end_dateTime);
    const lps = await this.prismaService.license_plates.findMany({
      where: {
        lpNumber: eventLog.license_plate,
        province: eventLog.province,
        cars: {
          some: {
            carBrand: eventLog.brand,
            dateTime: {
              gte: start_dateTime,
              lte: end_dateTime,
            },
          },
        },
      },
      include: {
        cars: {
          select: {
            carBrand: true,
            carImgUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return lps;
  }
}
