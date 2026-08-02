const LEGACY_DRAFT_KEY = 'chronicleTableVampireDraft';
const DRAFT_PREFIX = 'chronicleTableVampireDraft';

function getDraftKey(userId) {
  return `${DRAFT_PREFIX}:${userId}`;
}

export function loadVampireDraft(userId) {
  if (!userId) {
    return null;
  }

  try {
    const rawDraft =
      localStorage.getItem(getDraftKey(userId)) ??
      localStorage.getItem(LEGACY_DRAFT_KEY) ??
      sessionStorage.getItem(LEGACY_DRAFT_KEY);
    return rawDraft ? JSON.parse(rawDraft) : null;
  } catch {
    return null;
  }
}

export function saveVampireDraft(userId, character) {
  if (!userId) {
    return false;
  }

  try {
    localStorage.setItem(getDraftKey(userId), JSON.stringify(character));
    localStorage.removeItem(LEGACY_DRAFT_KEY);
    sessionStorage.removeItem(LEGACY_DRAFT_KEY);
    return true;
  } catch {
    return false;
  }
}
