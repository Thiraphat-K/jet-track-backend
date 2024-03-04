import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/common/user.service';
import { IUser, IUserRePwd } from 'src/interface/user.interface';
import { tags } from 'typia';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SettingService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async addUser(userData: IUser) {
    return await this.userService.createUser(userData, 'user');
  }

  async deleteUser(deleteData: {
    username: string & tags.MinLength<5>;
    access_delete?: string;
  }) {
    return await this.userService.deleteUserByIU(
      {
        username: deleteData.username,
      },
      deleteData.access_delete,
    );
  }

  async resetPassword(rePwdData: IUserRePwd) {
    const user = await this.userService.getUserByIU({ id: rePwdData.id });
    const isPwd = await argon2.verify(user.password, rePwdData.oldPassword, {
      secret: Buffer.from(await this.configService.get<string>('secret')!),
    });
    if (!isPwd)
      throw new UnauthorizedException({
        message: 'Password is wrong, please try again.',
      });
    const newPwd = await argon2.hash(rePwdData.newPassword, {
      type: argon2.argon2id,
      secret: Buffer.from(await this.configService.get<string>('secret')!),
    });
    return await this.userService.updateUser(user.id, {
      password: newPwd,
    });
  }
}
