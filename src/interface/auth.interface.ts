import { tags } from 'typia';

export interface ILogin {
  username: string & tags.MinLength<5>;
  password: string & tags.MinLength<8> & tags.MaxLength<30>;
}

export interface IAccessSignUp {
  'access-signup': string;
}

export interface ISignUp {
  username: string & tags.MinLength<5>;
  password: string & tags.MinLength<8> & tags.MaxLength<30>;
  firstname: string;
  lastname: string;
}
