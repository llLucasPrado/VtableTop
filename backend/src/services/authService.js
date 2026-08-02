const temporaryUser = Object.freeze({
  id: 1,
  name: 'Aventureiro',
  email: 'teste@chronicle.com',
});

const temporaryPassword = '123456';

export function authenticateUser(email, password) {
  // Futuro: buscar o usuário no banco de dados e comparar um hash de senha.
  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedEmail !== temporaryUser.email ||
    password !== temporaryPassword
  ) {
    return null;
  }

  return {
    user: temporaryUser,
    // Futuro: emitir JWT, refresh token e armazená-los de forma segura.
    token: 'temporary-token',
  };
}

