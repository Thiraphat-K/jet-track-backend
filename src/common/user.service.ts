import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { roles, users } from '@prisma/client';
import {
  IUser,
  IUserRes,
  IUserIU,
  IUserOptions,
  IUserUpdate,
} from 'src/interface/user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { tags } from 'typia';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(userData: IUser, role: roles): Promise<users> {
    const existed = await this.getUserByIU({ username: userData.username });
    if (existed)
      throw new NotAcceptableException({ message: 'User already exists.' });
    const hash = await argon2.hash(userData.password, {
      type: argon2.argon2id,
      secret: Buffer.from(await this.configService.get<string>('secret')!),
    });
    const createdBy: string | null = userData.created_by!;
    delete userData.created_by;
    const user = await this.prismaService.users.create({
      data: {
        ...userData,
        password: hash,
        role: role,
        createdBy,
      },
    });
    if (!user) throw new ForbiddenException({ message: 'Sign up failed.' });
    return user;
  }

  async getUserByIU(userIU: IUserIU): Promise<users> {
    let user: users;
    if (userIU.id !== undefined) {
      user = (await this.prismaService.users.findFirst({
        where: { id: userIU.id },
      })) as users;
    } else {
      user = (await this.prismaService.users.findUnique({
        where: {
          username: userIU.username,
        },
      })) as users;
    }
    return user;
  }

  async getUsersByCameraIU(
    options: IUserOptions,
  ): Promise<{ username: string }[]> {
    const user = this.prismaService.users.findMany({
      where: { ...options, role: options.role as roles },
      select: {
        username: true,
      },
    });
    return user;
  }

  async updateUser(
    id: string & tags.Format<'uuid'>,
    updataData: IUserUpdate,
  ): Promise<IUserRes> {
    const user = await this.prismaService.users.update({
      where: { id },
      data: {
        password: updataData.password,
        cameraId: updataData.camera_id,
        createdBy: updataData.created_by,
      },
    });
    const updated: string = Object.keys(updataData).join(',');
    return {
      username: user.username,
      message: `Your ${updated} has been updated.`,
    };
  }

  async deleteUserByIU(iu: IUserIU, accessDelete?: string): Promise<IUserRes> {
    const user = await this.getUserByIU({ username: iu.username });
    if (!user)
      throw new NotFoundException({
        message: 'Cannot delete, user not found.',
      });
    if (user.role === 'admin') {
      if (accessDelete === this.configService.get<string>('access-delete'))
        await this.prismaService.users.delete({
          where: { id: user.id },
        });
      else
        throw new ForbiddenException({
          message: 'Cannot delete admin account.',
        });
    } else
      await this.prismaService.users.delete({
        where: { id: user.id },
      });
    return { username: user.username, message: 'Successfully deleted.' };
  }
}
