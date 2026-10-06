import { createApp } from './app.js';
import { config } from './config/index.js';
import { startPgServer } from './scripts/start-pg-server.js';
import prisma from './repositories/prisma.js';

async function bootstrap() {
  try {
    // If in development mode and Postgres port 5432 is not currently active, auto-start embedded PG server
    if (config.isDev) {
      try {
        await startPgServer(5432);
      } catch (err) {
        console.warn('[Bootstrap] Note on DB server:', err);
      }
    }

    // Attempt database connection check
    try {
      await prisma.$connect();
      console.log('✅ PostgreSQL connected successfully via Prisma.');
    } catch (dbErr) {
      console.warn('⚠️ Prisma connection warning (database may still be starting):', dbErr);
    }

    const app = createApp();

    const server = app.listen(config.port, () => {
      console.log(`🚀 ExploreBD Backend API listening on http://localhost:${config.port}`);
      console.log(`🩺 Health endpoint available at http://localhost:${config.port}/api/health`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('[Server] Connections closed. Process exiting.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (fatalError) {
    console.error('❌ Failed to start ExploreBD server:', fatalError);
    process.exit(1);
  }
}

bootstrap();
