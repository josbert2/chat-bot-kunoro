import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthContext } from '../guards/bearer-auth.guard';

export const BearerAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthContext => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      throw new Error('BearerAuth decorator used without BearerAuthGuard');
    }
    return request.user;
  },
);

// Exportar tipo para usar en controladores
export type { AuthContext };

