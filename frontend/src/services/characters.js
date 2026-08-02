import { supabase } from '../lib/supabase.js';

export async function loadLatestCharacter(userId, systemId) {
  const { data, error } = await supabase
    .from('characters')
    .select('id, sheet_data, updated_at')
    .eq('user_id', userId)
    .eq('system_id', systemId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function saveCharacter({ character, characterId, systemId, userId }) {
  const { data, error } = await supabase
    .from('characters')
    .upsert(
      {
        id: characterId,
        user_id: userId,
        system_id: systemId,
        name: character.identity?.name?.trim() || 'Personagem sem nome',
        sheet_data: character,
        schema_version: 1,
      },
      { onConflict: 'id' },
    )
    .select('id, updated_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export function createCharacterId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);

  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const value = [...bytes]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}
