import { authenticateUser } from '../services/authService.js';

export function login(req, res) {
  const { email, password } = req.body ?? {};

  // Futuro: substituir por validação de schema mais robusta.
  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: 'E-mail e senha são obrigatórios.',
    });
  }

  const authentication = authenticateUser(email, password);

  if (!authentication) {
    return res.status(401).json({
      success: false,
      message: 'E-mail ou senha incorretos.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Login realizado com sucesso.',
    ...authentication,
  });
}

