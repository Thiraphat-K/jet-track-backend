import { tags } from 'typia';

export interface ICamera {
  user_id?: string & tags.Format<'uuid'>;
  rtsp_url: string &
    tags.Pattern<'^(rtsp):\\/\\/(?:([^\\s^@\\/]+?)[@])?([^\\s\\/:]+)(?:[:]([0-9]+))?([/\\s(.*)])?'>;
}

export interface ICameraIU {
  id?: string & tags.Format<'uuid'>;
  rtsp_url?: string &
    tags.Pattern<'^(rtsp):\\/\\/(?:([^\\s^@\\/]+?)[@])?([^\\s\\/:]+)(?:[:]([0-9]+))?([/\\s(.*)])?'>;
}
