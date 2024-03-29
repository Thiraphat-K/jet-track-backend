import { tags } from 'typia';
export interface ICameraIU {
  id?: string & tags.Format<'uuid'>;
  rtsp_ip?: string & tags.Format<'ipv4'>;
  user_id?: string & tags.Format<'uuid'>;
}

// tags.Pattern<'^(rtsp):\\/\\/(?:([^\\s^@\\/]+?)[@])?([^\\s\\/:]+)(?:[:]([0-9]+))?([/\\s(.*)])?'>
