import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/explorebd?schema=public',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'explorebd_super_secret_access_jwt_key_2026_bd',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'explorebd_super_secret_refresh_jwt_key_2026_bd',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  isDev: process.env.NODE_ENV !== 'production',
};
