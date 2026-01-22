import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!requiredRoles?.length) return true;

    const req = ctx.switchToHttp().getRequest();
    const role = req.user?.role;

    if (!role || !requiredRoles.includes(role)) {
      throw new ForbiddenException('Forbidden');
    }
    return true;
  }
}
