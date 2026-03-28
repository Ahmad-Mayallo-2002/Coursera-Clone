import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Payload } from '../../interfaces/payload.interface';
import { Role } from '../../enum/role.enum';

@Injectable()
export class AdminOrOwner implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as Payload;
    const targetId = req.params.id ?? req.params.userId;

    if (user.role === Role.ADMIN || targetId === user.id) return true;
    throw new ForbiddenException('Access is Denied, Admin or Owner Only');
  }
}
