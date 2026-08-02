import { Router } from 'express';

const healthRoutes = Router();

healthRoutes.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando corretamente.',
  });
});

export default healthRoutes;

