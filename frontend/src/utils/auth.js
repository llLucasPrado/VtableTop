const TOKEN_KEY = 'chronicleTableToken';
const USER_KEY = 'chronicleTableUser';

function safelyRead(storage, key) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function clearStorage(storage) {
  try {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
  } catch {
    // A aplicação continua utilizável quando o navegador bloqueia o storage.
  }
}

export function saveAuth({ token, user }, remember) {
  clearAuth();
  const storage = remember ? localStorage : sessionStorage;

  try {
    // Provisório: tokens não devem permanecer em Web Storage na autenticação final.
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    throw new Error(
      'Não foi possível salvar sua sessão. Verifique as permissões do navegador.',
    );
  }
}

export function getToken() {
  return (
    safelyRead(localStorage, TOKEN_KEY) ??
    safelyRead(sessionStorage, TOKEN_KEY)
  );
}

export function getUser() {
  const rawUser =
    safelyRead(localStorage, USER_KEY) ??
    safelyRead(sessionStorage, USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    clearAuth();
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function clearAuth() {
  clearStorage(localStorage);
  clearStorage(sessionStorage);
}

