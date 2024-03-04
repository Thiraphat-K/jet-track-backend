import { tags } from 'typia';

export interface ICar {
  rtsp_url: string;
  car_img_url: string;
  car_brand: string;
  lp_id: string & tags.Format<'uuid'>;
  date_time: string & tags.Format<'date-time'>;
}
