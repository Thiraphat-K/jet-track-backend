import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { roles } from '@prisma/client';
import { Observable } from 'rxjs';
import { ROLE_KEY } from 'src/decorator/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<roles>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRole) return true;
    const { user } = context.switchToHttp().getRequest();
    if (requiredRole !== user.role)
      throw new ForbiddenException({ message: 'Access denied.' });
    return requiredRole === user.role;
  }
}
