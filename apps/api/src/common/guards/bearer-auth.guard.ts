import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../config/database.service';
import { apiTokens, accounts, user } from '../../../../db/schema';
import { eq, and } from 'drizzle-orm';

export interface AuthContext {
  token: {
    id: string;
    name: string;
    accountId: string;
    userId: string;
    scopes: string[];
  };
  account: {
    id: string;
    name: string;
    plan: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

@Injectable()
export class BearerAuthGuard implements CanActivate {
  constructor(private readonly dbService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Se requiere token Bearer en el header Authorization');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Formato de token inválido');
    }

    const token = parts[1];
    const validation = await this.validateBearerToken(token);
    
    if (!validation.success) {
      throw new UnauthorizedException(validation.success === false ? validation.error : 'Invalid token');
    }

    request.user = validation.context;
    return true;
  }

  private async validateBearerToken(token: string): Promise<{ success: true; context: AuthContext } | { success: false; error: string }> {
    try {
      const db = this.dbService.getDb();

      // Buscar el token en la base de datos con joins
      const result = await db
        .select({
          token: apiTokens,
          account: accounts,
          user: user,
        })
        .from(apiTokens)
        .innerJoin(accounts, eq(apiTokens.accountId, accounts.id))
        .innerJoin(user, eq(apiTokens.userId, user.id))
        .where(
          and(
            eq(apiTokens.token, token),
            eq(apiTokens.isActive, true)
          )
        )
        .limit(1);

      if (result.length === 0) {
        return { success: false, error: 'Token inválido o inactivo' };
      }

      const { token: tokenData, account, user: userData } = result[0];

      // Verificar expiración
      if (tokenData.expiresAt && tokenData.expiresAt < new Date()) {
        return { success: false, error: 'Token expirado' };
      }

      // Actualizar última vez usado (sin await para no bloquear)
      db.update(apiTokens)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiTokens.id, tokenData.id))
        .then()
        .catch((err) => console.error('Error actualizando lastUsedAt:', err));

      // Parsear scopes
      let scopes: string[] = [];
      if (tokenData.scopes) {
        try {
          scopes = JSON.parse(tokenData.scopes);
        } catch (e) {
          console.error('Error parsing scopes:', e);
        }
      }

      return {
        success: true,
        context: {
          token: {
            id: tokenData.id,
            name: tokenData.name,
            accountId: tokenData.accountId,
            userId: tokenData.userId,
            scopes,
          },
          account: {
            id: account.id,
            name: account.name,
            plan: account.plan,
          },
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
          },
        },
      };
    } catch (error) {
      console.error('Error validando token Bearer:', error);
      return { success: false, error: 'Error interno al validar token' };
    }
  }
}

