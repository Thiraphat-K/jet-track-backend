import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IAccessSignUp, ILogin, ISignUp } from 'src/interface/auth.interface';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/common/user.service';
import { users } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { IPayload } from 'src/interface/common.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(access: IAccessSignUp, input: ISignUp) {
    const accessSignup = await this.configService.get<string>('access-signup');
    if (access['access-signup'] !== accessSignup)
      throw new ForbiddenException({ message: 'Access denied.' });
    delete input['access-signup'];
    return await this.userService.createUser(input, 'admin');
  }

  async logIn(input: ILogin): Promise<{ access_token: string }> {
    const user = (await this.userService.getUserByIU({
      username: input.username,
    })) as users;
    if (!user)
      throw new UnauthorizedException({
        message: 'Username/Password is wrong, please try again.',
      });
    const isPwd = await argon2.verify(user.password, input.password, {
      secret: Buffer.from(await this.configService.get<string>('secret')!),
    });
    if (!isPwd)
      throw new UnauthorizedException({
        message: 'Username/Password is wrong, please try again.',
      });
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async nextAuthLogIn(input: ILogin): Promise<IPayload> {
    const user = (await this.userService.getUserByIU({
      username: input.username,
    })) as users;
    if (!user)
      throw new UnauthorizedException({
        message: 'Username/Password is wrong, please try again.',
      });
    const isPwd = await argon2.verify(user.password, input.password, {
      secret: Buffer.from(await this.configService.get<string>('secret')!),
    });
    if (!isPwd)
      throw new UnauthorizedException({
        message: 'Username/Password is wrong, please try again.',
      });
    const payload = {
      id: user.id,
      sub: user.id,
      username: user.username,
      role: user.role,
    } as IPayload;
    return payload;
  }
}
