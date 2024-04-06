import { tags } from 'typia';
export interface ICameraIU {
  id?: string & tags.Format<'uuid'>;
  rtsp_ip?: string & tags.Format<'ipv4'>;
  user_id?: string & tags.Format<'uuid'>;
}

interface ICars {
  id: string & tags.Format<'uuid'>;
  dateTime: any;
  license_plates: {
    lpNumber: string;
    province: string;
    lpImgUrl: string;
  };
  carBrand: string;
  carImgUrl: string;
}

export interface ICameraCars {
  rtspIp: string & tags.Format<'ipv4'>;
  cars: ICars[];
}
// tags.Pattern<'^(rtsp):\\/\\/(?:([^\\s^@\\/]+?)[@])?([^\\s\\/:]+)(?:[:]([0-9]+))?([/\\s(.*)])?'>
