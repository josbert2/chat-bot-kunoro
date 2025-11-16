import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get databaseUrl(): string {
    return process.env.DATABASE_URL || '';
  }

  get redisUrl(): string {
    return process.env.REDIS_URL || 'redis://localhost:6379';
  }

  get jwtSecret(): string {
    return process.env.JWT_SECRET || '';
  }

  get jwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || '7d';
  }
}

