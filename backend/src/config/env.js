import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const parsedPort = Number.parseInt(process.env.PORT ?? '3001', 10);

export const env = Object.freeze({
  port: Number.isNaN(parsedPort) ? 3001 : parsedPort,
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV ?? 'development',
});
