import { tags } from 'typia';

export interface IPayload {
  id: string & tags.Format<'uuid'>;
  sub: string & tags.Format<'uuid'>;
  username: string & tags.MinLength<5>;
  role: string;
}

export interface IDataRealtime {
  date_time: string & tags.Format<'date-time'>;
  license_plate?: string;
  province: string;
  brand: string;
  img_car_path?: string;
  img_license_path?: string;
  rtsp_url?: string;
}

export interface IEventRealtime {
  date_time: string & tags.Format<'date-time'>;
  lp_number: string;
  province: string;
  brand: string;
  car_img_url: string;
  lp_img_url: string;
  rtsp_url?: string;
}

export interface IEventLog {
  license_plate?: string;
  province?: string;
  brand?: string;
  start_date_time?: string & tags.Format<'date-time'>;
  end_date_time?: string & tags.Format<'date-time'>;
}
