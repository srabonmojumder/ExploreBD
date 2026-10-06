import EmbeddedPostgres from 'embedded-postgres';
import path from 'node:path';
import fs from 'node:fs';
import net from 'node:net';

export async function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(800);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
}

export async function startPgServer(port = 5432): Promise<EmbeddedPostgres | null> {
  const inUse = await isPortInUse(port);
  if (inUse) {
    console.log(`[PG-Server] Port ${port} is already active. Using existing PostgreSQL instance.`);
    return null;
  }

  const dataDir = path.resolve(process.cwd(), 'data', 'pgdata');
  const pg = new EmbeddedPostgres({
    databaseDir: dataDir,
    port,
    user: 'postgres',
    password: 'password',
    persistent: true,
  });

  const isAlreadyInit = fs.existsSync(path.join(dataDir, 'PG_VERSION'));
  if (!isAlreadyInit) {
    console.log('[PG-Server] Initialising new PostgreSQL cluster...');
    await pg.initialise();
  }

  console.log(`[PG-Server] Starting PostgreSQL server on port ${port}...`);
  await pg.start();
  console.log('[PG-Server] PostgreSQL server started successfully!');

  try {
    await pg.createDatabase('explorebd');
  } catch {
    // Database may already exist, ignore
  }

  return pg;
}

// If executed directly
if (process.argv[1]?.includes('start-pg-server')) {
  startPgServer()
    .then((pg) => {
      if (pg) {
        console.log('[PG-Server] Ready for connections. Press Ctrl+C to stop.');
      }
    })
    .catch((err) => {
      console.error('[PG-Server] Fatal error:', err);
      process.exit(1);
    });
}
