export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Endpoint não encontrado: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(error, _req, res, _next) {
  const isInvalidJson =
    error instanceof SyntaxError &&
    error.status === 400 &&
    error.type === 'entity.parse.failed';
  const status = isInvalidJson ? 400 : 500;

  if (!isInvalidJson) {
    console.error(error);
  }

  res.status(status).json({
    success: false,
    message: isInvalidJson
      ? 'O corpo da requisição contém um JSON inválido.'
      : 'Ocorreu um erro interno no servidor.',
  });
}
