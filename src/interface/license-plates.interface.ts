import { tags } from 'typia';

export interface ILicense {
  lp_number: string;
  province: string;
  lp_img_url: string;
}

export interface ILicenseIU {
  id?: string & tags.Format<'uuid'>;
  lp_number?: string;
}
