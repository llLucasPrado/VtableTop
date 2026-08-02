import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  BookHeart,
  Brain,
  Check,
  CirclePlus,
  HeartPulse,
  MousePointerClick,
  Save,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import {
  ATTRIBUTE_GROUPS,
  EMPTY_VAMPIRE_CHARACTER,
  SKILL_GROUPS,
} from '../../config/vampireSheet.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  createCharacterId,
  loadLatestCharacter,
  saveCharacter,
} from '../../services/characters.js';
import {
  loadVampireDraft,
  saveVampireDraft,
} from '../../utils/vampireDraft.js';
import TrackBoxes from './TrackBoxes.jsx';
import TraitDots from './TraitDots.jsx';

const inputClasses =
  'min-h-11 w-full rounded-lg border border-neutral-800 bg-black/40 px-3.5 py-2.5 text-sm text-neutral-100 outline-none transition duration-200 placeholder:text-neutral-700 hover:border-neutral-700 hover:bg-black/55 focus:border-red-800 focus:bg-black/60 focus:ring-4 focus:ring-red-950/40';

function mergeCharacter(draft) {
  if (!draft) {
    return structuredClone(EMPTY_VAMPIRE_CHARACTER);
  }

  return {
    ...structuredClone(EMPTY_VAMPIRE_CHARACTER),
    ...draft,
    identity: {
      ...EMPTY_VAMPIRE_CHARACTER.identity,
      ...draft.identity,
    },
    attributes: {
      ...EMPTY_VAMPIRE_CHARACTER.attributes,
      ...draft.attributes,
    },
    skills: {
      ...EMPTY_VAMPIRE_CHARACTER.skills,
      ...draft.skills,
    },
  };
}

function CharacterSheet() {
  const { user } = useAuth();
  const [character, setCharacter] = useState(() =>
    mergeCharacter(loadVampireDraft(user?.id)),
  );
  const [characterId, setCharacterId] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState('loading');
  const saveQueue = useRef(Promise.resolve());
  const saveVersion = useRef(0);

  const healthMax = useMemo(
    () => (character.attributes.stamina ?? 1) + 3,
    [character.attributes.stamina],
  );
  const willpowerMax = useMemo(
    () =>
      (character.attributes.composure ?? 1) +
      (character.attributes.resolve ?? 1),
    [character.attributes.composure, character.attributes.resolve],
  );

  useEffect(() => {
    if (!user?.id) {
      return undefined;
    }

    let ignore = false;

    async function hydrateCharacter() {
      setSaveStatus('loading');

      try {
        const remoteCharacter = await loadLatestCharacter(user.id, 'vampire-v5');

        if (ignore) {
          return;
        }

        if (remoteCharacter) {
          setCharacter(mergeCharacter(remoteCharacter.sheet_data));
          setCharacterId(remoteCharacter.id);
          saveVampireDraft(user.id, remoteCharacter.sheet_data);
        } else {
          setCharacter(mergeCharacter(loadVampireDraft(user.id)));
          setCharacterId(createCharacterId());
        }

        setSaveStatus('saved');
      } catch {
        if (!ignore) {
          setCharacter(mergeCharacter(loadVampireDraft(user.id)));
          setCharacterId(createCharacterId());
          setSaveStatus('error');
        }
      } finally {
        if (!ignore) {
          setIsHydrated(true);
        }
      }
    }

    hydrateCharacter();

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!isHydrated || !characterId || !user?.id) {
      return undefined;
    }

    const version = ++saveVersion.current;
    saveVampireDraft(user.id, character);
    setSaveStatus('saving');

    const timeout = window.setTimeout(() => {
      saveQueue.current = saveQueue.current
        .catch(() => undefined)
        .then(() =>
          saveCharacter({
            character,
            characterId,
            systemId: 'vampire-v5',
            userId: user.id,
          }),
        );

      saveQueue.current
        .then(() => {
          if (version === saveVersion.current) {
            setSaveStatus('saved');
          }
        })
        .catch(() => {
          if (version === saveVersion.current) {
            setSaveStatus('error');
          }
        });
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [character, characterId, isHydrated, user?.id]);

  function updateIdentity(event) {
    const { name, value } = event.target;
    setCharacter((current) => ({
      ...current,
      identity: { ...current.identity, [name]: value },
    }));
  }

  function updateRating(section, traitId, value) {
    setCharacter((current) => ({
      ...current,
      [section]: { ...current[section], [traitId]: value },
    }));
  }

  function updateDiscipline(id, field, value) {
    setCharacter((current) => ({
      ...current,
      disciplines: current.disciplines.map((discipline) =>
        discipline.id === id ? { ...discipline, [field]: value } : discipline,
      ),
    }));
  }

  function addDiscipline() {
    setCharacter((current) => ({
      ...current,
      disciplines: [
        ...current.disciplines,
        {
          id: `discipline-${Date.now()}`,
          name: '',
          rating: 0,
          powers: '',
        },
      ],
    }));
  }

  function removeDiscipline(id) {
    setCharacter((current) => ({
      ...current,
      disciplines:
        current.disciplines.length === 1
          ? current.disciplines
          : current.disciplines.filter((discipline) => discipline.id !== id),
    }));
  }

  return (
    <div className="animate-sheet-enter mx-auto w-full max-w-7xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
            Ficha ativa
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-neutral-100">
            {character.identity.name || 'Novo personagem'}
          </h2>
        </div>
        <SaveIndicator status={saveStatus} />
      </div>

      <SheetSection
        eyebrow="O Sangue"
        title="Identidade"
        icon={BookHeart}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <IdentityField
            label="Nome"
            name="name"
            value={character.identity.name}
            onChange={updateIdentity}
            placeholder="Nome do personagem"
          />
          <IdentityField
            label="Conceito"
            name="concept"
            value={character.identity.concept}
            onChange={updateIdentity}
            placeholder="Quem ele era — e no que se tornou"
          />
          <IdentityField
            label="Tipo de Predador"
            name="predator"
            value={character.identity.predator}
            onChange={updateIdentity}
            placeholder="Sua forma habitual de caçar"
          />
          <IdentityField
            label="Crônica"
            name="chronicle"
            value={character.identity.chronicle}
            onChange={updateIdentity}
            placeholder="Nome da crônica"
          />
          <IdentityField
            label="Ambição"
            name="ambition"
            value={character.identity.ambition}
            onChange={updateIdentity}
            placeholder="Objetivo de longo prazo"
          />
          <IdentityField
            label="Clã"
            name="clan"
            value={character.identity.clan}
            onChange={updateIdentity}
            placeholder="Clã do personagem"
          />
          <IdentityField
            label="Senhor(a)"
            name="sire"
            value={character.identity.sire}
            onChange={updateIdentity}
            placeholder="Quem realizou o Abraço"
          />
          <IdentityField
            label="Desejo"
            name="desire"
            value={character.identity.desire}
            onChange={updateIdentity}
            placeholder="Objetivo imediato"
          />
          <IdentityField
            label="Geração"
            name="generation"
            value={character.identity.generation}
            onChange={updateIdentity}
            placeholder="Ex.: 12ª"
          />
        </div>
      </SheetSection>

      <SheetSection eyebrow="Corpo, presença e mente" title="Atributos" icon={Brain}>
        <div className="grid gap-4 lg:grid-cols-3">
          {ATTRIBUTE_GROUPS.map((group) => (
            <TraitGroup key={group.id} title={group.label}>
              {group.traits.map((trait) => (
                <TraitDots
                  key={trait.id}
                  label={trait.label}
                  value={character.attributes[trait.id]}
                  min={1}
                  onChange={(value) =>
                    updateRating('attributes', trait.id, value)
                  }
                />
              ))}
            </TraitGroup>
          ))}
        </div>

        <div className="mt-6 border-t border-neutral-900 pt-5">
          <p className="mb-4 flex items-center gap-2 text-xs text-neutral-600">
            <MousePointerClick className="size-3.5" aria-hidden="true" />
            Clique nas caixas para alternar entre dano superficial e agravado.
          </p>
          <div className="grid gap-5 lg:grid-cols-2">
          <TrackBoxes
            label={`Saúde · ${healthMax}`}
            max={healthMax}
            damage={character.healthDamage}
            onChange={(healthDamage) =>
              setCharacter((current) => ({ ...current, healthDamage }))
            }
          />
          <TrackBoxes
            label={`Força de Vontade · ${willpowerMax}`}
            max={willpowerMax}
            damage={character.willpowerDamage}
            onChange={(willpowerDamage) =>
              setCharacter((current) => ({ ...current, willpowerDamage }))
            }
          />
          </div>
        </div>
      </SheetSection>

      <SheetSection eyebrow="Treinamento e experiência" title="Perícias" icon={Users}>
        <div className="grid gap-4 lg:grid-cols-3">
          {SKILL_GROUPS.map((group) => (
            <TraitGroup key={group.id} title={group.label}>
              {group.skills.map(([skillId, label]) => (
                <TraitDots
                  key={skillId}
                  label={label}
                  value={character.skills[skillId]}
                  onChange={(value) => updateRating('skills', skillId, value)}
                />
              ))}
            </TraitGroup>
          ))}
        </div>
      </SheetSection>

      <SheetSection eyebrow="Dons do Sangue" title="Disciplinas" icon={Sparkles}>
        <div className="space-y-3">
          {character.disciplines.map((discipline, index) => (
            <div
              key={discipline.id}
              className="group grid gap-3 rounded-xl border border-neutral-900 bg-black/25 p-4 transition duration-200 hover:border-red-950/80 hover:bg-red-950/5 lg:grid-cols-[minmax(12rem,0.8fr)_auto_minmax(16rem,1.2fr)_auto] lg:items-center"
            >
              <input
                value={discipline.name}
                onChange={(event) =>
                  updateDiscipline(discipline.id, 'name', event.target.value)
                }
                className={inputClasses}
                aria-label={`Nome da disciplina ${index + 1}`}
                placeholder="Nome da disciplina"
              />
              <TraitDots
                label="Nível"
                value={discipline.rating}
                onChange={(value) =>
                  updateDiscipline(discipline.id, 'rating', value)
                }
              />
              <input
                value={discipline.powers}
                onChange={(event) =>
                  updateDiscipline(discipline.id, 'powers', event.target.value)
                }
                className={inputClasses}
                aria-label={`Poderes da disciplina ${index + 1}`}
                placeholder="Poderes conhecidos"
              />
              <button
                type="button"
                onClick={() => removeDiscipline(discipline.id)}
                disabled={character.disciplines.length === 1}
                aria-label={`Remover disciplina ${index + 1}`}
                className="flex size-10 cursor-pointer items-center justify-center rounded-lg border border-neutral-800 text-neutral-600 transition hover:border-red-900 hover:bg-red-950/30 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 disabled:pointer-events-none disabled:opacity-25"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addDiscipline}
          className="mt-4 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-red-950/80 bg-red-950/15 px-4 py-2 text-sm font-semibold text-red-400 transition hover:-translate-y-0.5 hover:border-red-800 hover:bg-red-950/30 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
        >
          <CirclePlus className="size-4" aria-hidden="true" />
          Adicionar disciplina
        </button>
      </SheetSection>

      <SheetSection eyebrow="A Besta Interior" title="Sangue e Humanidade" icon={HeartPulse}>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto_auto] lg:items-end">
          <IdentityField
            label="Ressonância"
            name="resonance"
            value={character.resonance}
            onChange={(event) =>
              setCharacter((current) => ({
                ...current,
                resonance: event.target.value,
              }))
            }
            placeholder="Ressonância atual"
          />
          <div className="rounded-xl border border-red-950/80 bg-red-950/15 p-4">
            <TraitDots
              label="Fome"
              value={character.hunger}
              max={5}
              variant="hunger"
              onChange={(hunger) =>
                setCharacter((current) => ({ ...current, hunger }))
              }
            />
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
            <TraitDots
              label="Humanidade"
              value={character.humanity}
              max={10}
              variant="humanity"
              onChange={(humanity) =>
                setCharacter((current) => ({ ...current, humanity }))
              }
            />
          </div>
        </div>
      </SheetSection>
    </div>
  );
}

function SheetSection({ eyebrow, title, icon: Icon, children }) {
  return (
    <section className="group relative overflow-hidden rounded-2xl border border-neutral-900 bg-[#0b0b0c]/95 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.34)] transition duration-300 hover:border-red-950/70 sm:p-6">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 size-52 rounded-full bg-red-950/0 blur-3xl transition duration-500 group-hover:bg-red-950/15"
      />
      <header className="relative mb-5 flex items-center gap-3 border-b border-neutral-900 pb-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-red-950/80 bg-red-950/25 text-red-500 transition group-hover:border-red-900 group-hover:text-red-400">
          <Icon className="size-[1.125rem]" strokeWidth={1.7} aria-hidden="true" />
        </span>
        <div>
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-red-800">
            {eyebrow}
          </p>
          <h3 className="mt-1 font-serif text-xl font-bold text-neutral-100">
            {title}
          </h3>
        </div>
      </header>
      <div className="relative">{children}</div>
    </section>
  );
}

function TraitGroup({ title, children }) {
  return (
    <div className="rounded-xl border border-neutral-900 bg-black/25 p-4 transition duration-200 hover:border-neutral-800 hover:bg-black/35">
      <p className="mb-4 font-serif text-sm font-bold italic tracking-wide text-red-400">
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function IdentityField({ label, ...inputProps }) {
  return (
    <label className="group/field block">
      <span className="mb-1.5 block text-xs font-medium text-neutral-500 transition group-focus-within/field:text-red-400">
        {label}
      </span>
      <input {...inputProps} className={inputClasses} />
    </label>
  );
}

function SaveIndicator({ status }) {
  const states = {
    loading: {
      icon: Activity,
      text: 'Carregando ficha...',
      classes: 'border-neutral-800 text-neutral-500',
    },
    saving: {
      icon: Save,
      text: 'Salvando na nuvem...',
      classes: 'border-neutral-800 text-neutral-500',
    },
    saved: {
      icon: Check,
      text: 'Salvo na nuvem',
      classes: 'border-emerald-950/70 text-emerald-600',
    },
    error: {
      icon: Activity,
      text: 'Salvo apenas neste dispositivo',
      classes: 'border-red-950 text-red-500',
    },
  };
  const state = states[status];
  const Icon = state.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border bg-black/30 px-3 py-1.5 text-xs transition ${state.classes}`}
      role="status"
    >
      <Icon
        className={`size-3.5 ${status === 'saving' || status === 'loading' ? 'animate-pulse' : ''}`}
        aria-hidden="true"
      />
      {state.text}
    </span>
  );
}

export default CharacterSheet;
