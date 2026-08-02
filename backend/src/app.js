import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import {
  errorHandler,
  notFoundHandler,
} from './middlewares/errorHandler.js';

const app = express();

app.disable('x-powered-by');
app.use(
  cors({
    origin: env.frontendUrl,
  }),
);
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

