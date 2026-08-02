import { Router } from 'express';
import { login } from '../controllers/authController.js';

const authRoutes = Router();

// Futuro: adicionar limitação de tentativas de login por IP e por usuário.
authRoutes.post('/login', login);

export default authRoutes;

