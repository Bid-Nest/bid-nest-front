import dotenv from 'dotenv';
import path from 'path';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.prod'
    : process.env.NODE_ENV === 'test'
      ? '.env.test'
      : '.env.dev';

dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

const ensureEnv = (value: string | undefined, variableName: string): string => {
  if (!value) {
    throw new Error(`Missing environment variable: ${variableName}`);
  }
  return value;
};

export const config = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  jwtSecret: ensureEnv(process.env.JWT_SECRET, 'JWT_SECRET'),
  tokenDuration: process.env.TOKEN_DURATION || '3600',
  nodeEnv: process.env.NODE_ENV || 'development',
  vitePort: process.env.VITE_PORT || 5173,
  mongoDbUri: ensureEnv(process.env.MONGODB_URI, 'MONGODB_URI'),
  saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
  sessionSecret: ensureEnv(process.env.SESSION_SECRET, 'SESSION_SECRET'),
  cookieMaxAge: parseInt(process.env.COOKIE_MAX_AGE || '86400000', 10),
};
