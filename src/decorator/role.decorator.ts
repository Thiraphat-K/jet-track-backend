import { SetMetadata } from '@nestjs/common';
import { roles } from '@prisma/client';

export const ROLE_KEY = 'role';
export const Role = (role: roles) => SetMetadata(ROLE_KEY, role);
