import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { user, accounts, account } from '../db/schema.js';
import { AppError } from '../middleware/error.middleware.js';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  workspace: {
    id: string;
    name: string;
    plan: string;
  } | null;
}

class AuthService {
  private generateToken(payload: { userId: string; accountId: string; email: string }): string {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-me';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    console.log('🔵 [AUTH SERVICE] Generando token para:', payload.email);
    console.log('🔵 [AUTH SERVICE] Usando JWT_SECRET:', secret === 'your-secret-key-change-me' ? 'DEFAULT' : 'FROM ENV');

    const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
    console.log('🔵 [AUTH SERVICE] Token generado (primeros 20 chars):', token.substring(0, 20) + '...');

    return token;
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    console.log('🟢 [AUTH SERVICE] Iniciando registro para:', input.email);

    // Validaciones
    if (!input.password || input.password.length < 8) {
      throw new AppError(400, 'La contraseña debe tener al menos 8 caracteres');
    }

    const database = await db.connect();
    if (!database) throw new AppError(500, 'Error de conexión a base de datos');

    // Verificar si el email ya existe
    const [existingUser] = await database
      .select()
      .from(user)
      .where(eq(user.email, input.email))
      .limit(1);

    if (existingUser) {
      throw new AppError(400, 'El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const userId = uuidv4();
    const workspaceId = uuidv4();

    console.log('🟢 [AUTH SERVICE] Creando usuario y workspace...');

    // Insertar usuario
    await database.insert(user).values({
      id: userId,
      name: input.name,
      email: input.email,
      emailVerified: false,
    });

    // Insertar workspace
    await database.insert(accounts).values({
      id: workspaceId,
      name: input.name || 'Mi workspace',
      plan: 'free',
    });

    // Actualizar usuario con workspace
    await database
      .update(user)
      .set({ accountId: workspaceId })
      .where(eq(user.id, userId));

    // Insertar credenciales
    await database.insert(account).values({
      id: uuidv4(),
      accountId: 'email',
      providerId: input.email,
      userId,
      password: hashedPassword,
    });

    const token = this.generateToken({
      userId,
      accountId: workspaceId,
      email: input.email,
    });

    console.log('✅ [AUTH SERVICE] Registro completado');

    return {
      token,
      user: {
        id: userId,
        name: input.name,
        email: input.email,
      },
      workspace: {
        id: workspaceId,
        name: input.name || 'Mi workspace',
        plan: 'free',
      },
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    console.log('🟢 [AUTH SERVICE] Iniciando login para:', input.email);

    const database = await db.connect();
    if (!database) throw new AppError(500, 'Error de conexión a base de datos');

    // Buscar usuario
    const [foundUser] = await database
      .select()
      .from(user)
      .where(eq(user.email, input.email))
      .limit(1);

    if (!foundUser) {
      throw new AppError(401, 'Credenciales inválidas');
    }

    // Buscar credenciales
    const [accountRecord] = await database
      .select()
      .from(account)
      .where(eq(account.userId, foundUser.id))
      .limit(1);

    if (!accountRecord || !accountRecord.password) {
      throw new AppError(401, 'Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(input.password, accountRecord.password);

    if (!isPasswordValid) {
      throw new AppError(401, 'Credenciales inválidas');
    }

    // Buscar workspace
    let workspace = null;
    if (foundUser.accountId) {
      const [ws] = await database
        .select()
        .from(accounts)
        .where(eq(accounts.id, foundUser.accountId))
        .limit(1);

      if (ws) {
        workspace = {
          id: ws.id,
          name: ws.name,
          plan: ws.plan,
        };
      }
    }

    const token = this.generateToken({
      userId: foundUser.id,
      accountId: foundUser.accountId || '',
      email: foundUser.email,
    });

    console.log('✅ [AUTH SERVICE] Login completado');

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

  async getMe(userId: string) {
    console.log('🟢 [AUTH SERVICE] Obteniendo usuario:', userId);

    const database = await db.connect();
    if (!database) throw new AppError(500, 'Error de conexión a base de datos');

    const [foundUser] = await database
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser) {
      throw new AppError(404, 'Usuario no encontrado');
    }

    let workspace = null;
    if (foundUser.accountId) {
      const [ws] = await database
        .select()
        .from(accounts)
        .where(eq(accounts.id, foundUser.accountId))
        .limit(1);

      if (ws) {
        workspace = {
          id: ws.id,
          name: ws.name,
          plan: ws.plan,
          businessModel: ws.businessModel,
          platform: ws.platform,
          useAi: ws.useAi,
          goalId: ws.goalId,
        };
      }
    }

    return {
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      },
      account: workspace, // Usar 'account' en lugar de 'workspace' para consistencia con el frontend
    };
  }
}

export const authService = new AuthService();

