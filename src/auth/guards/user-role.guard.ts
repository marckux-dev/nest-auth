import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>(
      META_ROLES,
      context.getHandler(),
    );
    if (!roles || roles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    const hasRole = roles.some((role) => user.roles.includes(role));
    if (hasRole) {
      return true;
    } else {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
  }
}
