import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { IS_PUBLIC_KEY } from 'src/decorator/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    // console.log(req['cookies']);
    const token = this.extractTokenFromHeader(req);
    if (!token)
      throw new UnauthorizedException({
        message: 'Please enter your access token.',
      });
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: await this.configService.get<string>('jwt-secret'),
      });
      req['user'] = payload;
    } catch {
      throw new UnauthorizedException('Please log in again.');
    }
    return true;
  }

  private extractTokenFromHeader(req: FastifyRequest): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
