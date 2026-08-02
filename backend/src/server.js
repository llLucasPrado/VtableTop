import app from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.port, () => {
  console.log(
    `Chronicle Table API disponível em http://localhost:${env.port}`,
  );
});

function shutdown(signal) {
  console.log(`\n${signal} recebido. Encerrando a API...`);
  server.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

