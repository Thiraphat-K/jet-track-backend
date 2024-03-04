import { tags } from 'typia';

export interface IUser {
  username: string & tags.MinLength<5>;
  password: string & tags.MinLength<8> & tags.MaxLength<30>;
  firstname: string;
  lastname: string;
  // role: string & tags.Default<ERoles>;
  created_by?: string;
  camera_id?: string;
}

export interface IUserIU {
  id?: string & tags.Format<'uuid'>;
  username?: string & tags.MinLength<5>;
}

export interface IUserUpdate {
  password?: string & tags.MinLength<8> & tags.MaxLength<30>;
  created_by?: string & tags.Format<'uuid'>;
  camera_id?: string & tags.Format<'uuid'>;
}

export interface IUserRes {
  username: string & tags.MinLength<5>;
  message: string;
}

export interface IUserOptions {
  id?: string & tags.Format<'uuid'>;
  username?: string & tags.MinLength<5>;
  firstname?: string;
  lastname?: string;
  role?: string & tags.Default<ERoles>;
  created_by?: string;
  camera_id?: string;
}

export interface IUserRePwd {
  id?: string & tags.Format<'uuid'>;
  oldPassword: string & tags.MinLength<8> & tags.MaxLength<30>;
  newPassword: string & tags.MinLength<8> & tags.MaxLength<30>;
}

enum ERoles {
  'user',
  'admin',
}
