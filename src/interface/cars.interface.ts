import { tags } from 'typia';

export interface ICar {
  rtsp_ip: string;
  car_img_url: string;
  car_brand: string;
  lp_id: string & tags.Format<'uuid'>;
  date_time: string & tags.Format<'date-time'>;
}

export interface ICarU {
  id?: string & tags.Format<'uuid'>;
}

export interface ICars {
  id: string & tags.Format<'uuid'>;
  dateTime: any;
  cameraId: string & tags.Format<'uuid'>;
  license_plates: {
    lpNumber: string;
    province: string;
    lpImgUrl: string;
  };
  carBrand: string;
  carImgUrl: string;
  createdAt: any;
  rtspIp: string & tags.Format<'ipv4'>;
}
