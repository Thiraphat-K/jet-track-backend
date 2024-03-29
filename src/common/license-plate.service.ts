import { Injectable } from '@nestjs/common';
import { license_plates } from '@prisma/client';
import { ILicense, ILicenseIU } from 'src/interface/license-plates.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LicensePlateService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLicensePlate(lpData: ILicense): Promise<license_plates> {
    const existed = await this.getLicenceByIU({ lp_number: lpData.lp_number });
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

  async getAllLicenses(): Promise<any[]> {
    const lps = await this.prismaService.license_plates.findMany({});
    return lps;
  }
}
