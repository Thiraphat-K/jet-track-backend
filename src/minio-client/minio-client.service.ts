import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioClient, MinioService } from 'nestjs-minio-client';
import { IDataRealtime } from 'src/interface/common.interface';

@Injectable()
export class MinioClientService {
  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  async getClient(): Promise<MinioClient> {
    return await this.minioService.client;
  }

  async getJsonData(body: any): Promise<IDataRealtime> {
    try {
      const jsonName: string = (body!['Key'] as string).split('/')[1];
      const jsonFile = (await this.getClient()).getObject(
        (await this.configService.get<string>('minio-bucket'))!,
        jsonName,
      );
      const rawData = (await jsonFile).read();
      const jsonData: IDataRealtime = JSON.parse(rawData);
      return jsonData;
    } catch {
      throw new InternalServerErrorException({
        message: 'Can not get json data.',
      });
    }
  }
}
