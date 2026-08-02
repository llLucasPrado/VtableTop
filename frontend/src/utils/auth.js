const SYSTEM_KEY = 'chronicleTableSystem';
const LEGACY_AUTH_KEYS = ['chronicleTableToken', 'chronicleTableUser'];

function safelyRead(storage, key) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function saveSelectedSystem(systemId) {
  try {
    localStorage.setItem(SYSTEM_KEY, systemId);
  } catch {
    throw new Error('Não foi possível salvar o sistema selecionado.');
  }
}

export function getSelectedSystem() {
  return safelyRead(localStorage, SYSTEM_KEY);
}

export function clearLocalSessionData() {
  try {
    localStorage.removeItem(SYSTEM_KEY);
    sessionStorage.removeItem(SYSTEM_KEY);

    LEGACY_AUTH_KEYS.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  } catch {
    // O encerramento da sessão do Supabase continua sendo a fonte principal.
  }
}
