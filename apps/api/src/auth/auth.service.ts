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
    const db = this.dbService.getDb();

    if (!body.password || body.password.length < 8) {
      throw new BadRequestException("La contraseña debe tener al menos 8 caracteres");
    }

    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, body.email))
      .limit(1);

    if (existingUser) {
      throw new BadRequestException("El email ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const userId = uuidv4();
    const workspaceId = uuidv4();

    await db.insert(user).values({
      id: userId,
      name: body.name,
      email: body.email,
      emailVerified: false,
    });

    await db.insert(accounts).values({
      id: workspaceId,
      name: body.name || "Mi workspace",
      plan: "free",
    });

    await db
      .update(user)
      .set({ accountId: workspaceId })
      .where(eq(user.id, userId));

    await db.insert(account).values({
      id: uuidv4(),
      accountId: "email",
      providerId: body.email,
      userId,
      password: hashedPassword,
    });

    const token = this.generateToken({
      userId,
      accountId: workspaceId,
      email: body.email,
    });

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
  }

  async login(body: LoginBody): Promise<AuthResponse> {
    const db = this.dbService.getDb();

    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, body.email))
      .limit(1);

    if (!foundUser) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const [accountRecord] = await db
      .select()
      .from(account)
      .where(eq(account.userId, foundUser.id))
      .limit(1);

    if (!accountRecord || !accountRecord.password || typeof accountRecord.password !== "string") {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const isPasswordValid = await bcrypt.compare(body.password, accountRecord.password as string);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    if (!foundUser.accountId) {
      throw new UnauthorizedException("Workspace no encontrado para este usuario");
    }

    const [workspace] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, foundUser.accountId))
      .limit(1);

    if (!workspace) {
      throw new UnauthorizedException("Workspace no encontrado para este usuario");
    }

    const token = this.generateToken({
      userId: foundUser.id,
      accountId: workspace.id,
      email: foundUser.email,
    });

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

    return jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
  }
}
