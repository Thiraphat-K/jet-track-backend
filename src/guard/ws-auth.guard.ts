import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IS_PUBLIC_KEY } from 'src/decorator/public.decorator';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const client: Socket = context.switchToWs().getClient();
    const secret = this.validateSecretKey(client);
    if (!secret) {
      throw new WsException('Please enter the access web-socket key.');
    }
    const verifySecretKey =
      (await this.configService.get<string>('ws-secret_key')) === secret;
    if (!verifySecretKey)
      throw new WsException(
        'Please check your access web-socket information again.',
      );
    return true;
  }

  private validateSecretKey(client: Socket) {
    const [type, secret] =
      client.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Secret' ? secret : undefined;
  }
}
