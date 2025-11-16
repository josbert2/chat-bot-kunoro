import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { DatabaseService } from "../config/database.service";
import { account, accounts, user } from "../../../../db/schema";

type RegisterBody = { name: string; email: string; password: string };
type LoginBody = { email: string; password: string };

type JwtPayload = { userId: string; accountId: string; email: string };

type AuthResponse = {
  token: string;
  user: { id: string; name: string; email: string };
  workspace: { id: string; name: string; plan: string } | null;
};

@Injectable()
export class AuthService {
  constructor(private readonly dbService: DatabaseService) {}

  async register(body: RegisterBody): Promise<AuthResponse> {
    console.log('🟢 [AUTH SERVICE] Iniciando registro:', {
      name: body.name,
      email: body.email,
      hasPassword: !!body.password,
      passwordLength: body.password?.length || 0,
    });

    const db = this.dbService.getDb();

    if (!body.password || body.password.length < 8) {
      console.error('❌ [AUTH SERVICE] Contraseña inválida:', {
        hasPassword: !!body.password,
        length: body.password?.length || 0,
      });
      throw new BadRequestException("La contraseña debe tener al menos 8 caracteres");
    }

    console.log('🟢 [AUTH SERVICE] Verificando si el email ya existe...');
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, body.email))
      .limit(1);

    if (existingUser) {
      console.error('❌ [AUTH SERVICE] Email ya registrado:', body.email);
      throw new BadRequestException("El email ya está registrado");
    }

    console.log('🟢 [AUTH SERVICE] Email disponible, creando usuario...');
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const userId = uuidv4();
    const workspaceId = uuidv4();

    console.log('🟢 [AUTH SERVICE] IDs generados:', { userId, workspaceId });

    try {
      console.log('🟢 [AUTH SERVICE] Insertando usuario...');
      await db.insert(user).values({
        id: userId,
        name: body.name,
        email: body.email,
        emailVerified: false,
      });
      console.log('✅ [AUTH SERVICE] Usuario insertado correctamente');

      console.log('🟢 [AUTH SERVICE] Insertando workspace...');
      await db.insert(accounts).values({
        id: workspaceId,
        name: body.name || "Mi workspace",
        plan: "free",
      });
      console.log('✅ [AUTH SERVICE] Workspace insertado correctamente');

      console.log('🟢 [AUTH SERVICE] Actualizando accountId del usuario...');
      await db
        .update(user)
        .set({ accountId: workspaceId })
        .where(eq(user.id, userId));
      console.log('✅ [AUTH SERVICE] AccountId actualizado correctamente');

      console.log('🟢 [AUTH SERVICE] Insertando account (credenciales)...');
      await db.insert(account).values({
        id: uuidv4(),
        accountId: "email",
        providerId: body.email,
        userId,
        password: hashedPassword,
      });
      console.log('✅ [AUTH SERVICE] Account insertado correctamente');

      console.log('🟢 [AUTH SERVICE] Generando token JWT...');
      const token = this.generateToken({
        userId,
        accountId: workspaceId,
        email: body.email,
      });
      console.log('✅ [AUTH SERVICE] Token generado correctamente');

      console.log('✅ [AUTH SERVICE] Registro completado exitosamente para:', body.email);
      return {
        token,
        user: {
          id: userId,
          name: body.name,
          email: body.email,
        },
        workspace: {
          id: workspaceId,
          name: body.name || "Mi workspace",
          plan: "free",
        },
      };
    } catch (error) {
      console.error('❌ [AUTH SERVICE] Error durante el registro:', error);
      console.error('❌ [AUTH SERVICE] Detalles del error:', {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      });
      throw new InternalServerErrorException('Error al crear la cuenta. Por favor intenta de nuevo.');
    }
  }

  async login(body: LoginBody): Promise<AuthResponse> {
    console.log('🟢 [AUTH SERVICE] Iniciando login:', {
      email: body.email,
      hasPassword: !!body.password,
    });

    const db = this.dbService.getDb();

    console.log('🟢 [AUTH SERVICE] Buscando usuario por email...');
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, body.email))
      .limit(1);

    if (!foundUser) {
      console.error('❌ [AUTH SERVICE] Usuario no encontrado:', body.email);
      throw new UnauthorizedException("Credenciales inválidas");
    }

    console.log('🟢 [AUTH SERVICE] Usuario encontrado, buscando credenciales...');
    const [accountRecord] = await db
      .select()
      .from(account)
      .where(eq(account.userId, foundUser.id))
      .limit(1);

    if (!accountRecord || !accountRecord.password || typeof accountRecord.password !== "string") {
      console.error('❌ [AUTH SERVICE] Credenciales no encontradas o inválidas para usuario:', foundUser.id);
      throw new UnauthorizedException("Credenciales inválidas");
    }

    console.log('🟢 [AUTH SERVICE] Verificando contraseña...');
    const isPasswordValid = await bcrypt.compare(body.password, accountRecord.password as string);

    if (!isPasswordValid) {
      console.error('❌ [AUTH SERVICE] Contraseña incorrecta para:', body.email);
      throw new UnauthorizedException("Credenciales inválidas");
    }

    console.log('✅ [AUTH SERVICE] Contraseña válida, verificando workspace...');
    if (!foundUser.accountId) {
      console.error('❌ [AUTH SERVICE] Usuario sin accountId:', foundUser.id);
      throw new UnauthorizedException("Workspace no encontrado para este usuario");
    }

    const [workspace] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, foundUser.accountId))
      .limit(1);

    if (!workspace) {
      console.error('❌ [AUTH SERVICE] Workspace no encontrado:', foundUser.accountId);
      throw new UnauthorizedException("Workspace no encontrado para este usuario");
    }

    console.log('🟢 [AUTH SERVICE] Generando token...');
    const token = this.generateToken({
      userId: foundUser.id,
      accountId: workspace.id,
      email: foundUser.email,
    });

    console.log('✅ [AUTH SERVICE] Login exitoso para:', body.email);
    return {
      token,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      },
      workspace,
    };
  }

  async refresh(refreshToken: string) {
    // TODO: Implementar refresh tokens cuando definamos sesiones estilo Tidio
    throw new BadRequestException("Refresh tokens no implementados aún");
  }

  async getMe(userId: string) {
    const db = this.dbService.getDb();

    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser) {
      throw new UnauthorizedException("Usuario no encontrado");
    }

    const [workspace] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, foundUser.accountId || ""))
      .limit(1);

    return {
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      },
      workspace: workspace || null,
    };
  }

  private generateToken(payload: JwtPayload): string {
    const secret = process.env.JWT_SECRET || "your-secret-key-change-me";

    if (!secret || secret === "your-secret-key") {
      throw new InternalServerErrorException("JWT_SECRET no configurado");
    }

    const expiresInValue = process.env.JWT_EXPIRES_IN || "7d";
    
    return jwt.sign(payload, secret, {
      expiresIn: expiresInValue as any,
    });
  }
}
