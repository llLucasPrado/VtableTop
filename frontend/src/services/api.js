const API_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'
).replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, { status = 0, type = 'api' } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.type = type;
  }
}

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(
      'Não foi possível conectar à API. Confirme se o servidor está em execução.',
      { type: 'network' },
    );
  }

  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new ApiError('A API retornou uma resposta inválida.', {
        status: response.status,
        type: 'invalid-response',
      });
    }
  }

  if (!response.ok) {
    throw new ApiError(data?.message ?? 'Não foi possível concluir a operação.', {
      status: response.status,
      type: response.status === 401 ? 'credentials' : 'api',
    });
  }

  return data;
}

export function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

