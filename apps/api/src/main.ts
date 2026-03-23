import { env } from './config/env';
import { createApp } from './create-app';
import { prisma } from './lib/prisma';
import { ensureStorageDirectories } from './lib/storage';

async function bootstrap() {
  ensureStorageDirectories();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(`API ready at http://localhost:${env.PORT}/api`);
  });

  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);

    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  server.on('error', console.error);
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch(async (error) => {
  console.error('Failed to start API', error);
  await prisma.$disconnect();
  process.exit(1);
});
