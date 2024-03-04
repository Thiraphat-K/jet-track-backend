import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { SettingService } from './setting.service';
import { IUser, IUserRePwd } from 'src/interface/user.interface';
import { tags } from 'typia';
import { roles } from '@prisma/client';
import { Role } from 'src/decorator/role.decorator';
import { User } from 'src/decorator/user.decorator';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Role(roles.admin)
  @TypedRoute.Post('add-user')
  async settingAddUser(
    @User('sub') uCreater: string & tags.Format<'uuid'>,
    @TypedBody() input: IUser,
  ) {
    return await this.settingService.addUser({
      ...input,
      created_by: uCreater,
    });
  }

  @Role(roles.admin)
  @TypedRoute.Delete('delete-user')
  async settingDeleteUser(
    @TypedBody()
    input: {
      username: string & tags.MinLength<5>;
      access_delete?: string;
    },
  ) {
    return await this.settingService.deleteUser(input);
  }

  @TypedRoute.Post('reset-pwd')
  async settingResetPwd(
    @User('sub') userId: string & tags.Format<'uuid'>,
    @TypedBody() input: IUserRePwd,
  ) {
    return await this.settingService.resetPassword({ ...input, id: userId });
  }
}
