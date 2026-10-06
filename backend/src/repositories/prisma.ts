import { PrismaClient } from '@prisma/client';
import { config } from '../config/index.js';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: config.isDev ? ['warn', 'error'] : ['error'],
  });

if (config.isDev) {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
