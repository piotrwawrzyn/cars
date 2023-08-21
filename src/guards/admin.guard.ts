import { CanActivate, ExecutionContext, UseGuards } from '@nestjs/common';

export function AdminOnly() {
  return UseGuards(new AdminGuard());
}

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.currentUser) return false;

    return request.currentUser.admin;
  }
}
