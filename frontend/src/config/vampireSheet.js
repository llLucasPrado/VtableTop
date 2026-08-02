export const ATTRIBUTE_GROUPS = Object.freeze([
  {
    id: 'physical',
    label: 'Físicos',
    traits: [
      { id: 'strength', label: 'Força' },
      { id: 'dexterity', label: 'Destreza' },
      { id: 'stamina', label: 'Vigor' },
    ],
  },
  {
    id: 'social',
    label: 'Sociais',
    traits: [
      { id: 'charisma', label: 'Carisma' },
      { id: 'manipulation', label: 'Manipulação' },
      { id: 'composure', label: 'Autocontrole' },
    ],
  },
  {
    id: 'mental',
    label: 'Mentais',
    traits: [
      { id: 'intelligence', label: 'Inteligência' },
      { id: 'wits', label: 'Raciocínio' },
      { id: 'resolve', label: 'Determinação' },
    ],
  },
]);

export const SKILL_GROUPS = Object.freeze([
  {
    id: 'physical',
    label: 'Físicas',
    skills: [
      ['athletics', 'Atletismo'],
      ['brawl', 'Briga'],
      ['craft', 'Ofícios'],
      ['drive', 'Condução'],
      ['firearms', 'Armas de Fogo'],
      ['larceny', 'Furto'],
      ['melee', 'Armas Brancas'],
      ['stealth', 'Furtividade'],
      ['survival', 'Sobrevivência'],
    ],
  },
  {
    id: 'social',
    label: 'Sociais',
    skills: [
      ['animalKen', 'Empatia com Animais'],
      ['etiquette', 'Etiqueta'],
      ['insight', 'Intuição'],
      ['intimidation', 'Intimidação'],
      ['leadership', 'Liderança'],
      ['performance', 'Performance'],
      ['persuasion', 'Persuasão'],
      ['streetwise', 'Manha'],
      ['subterfuge', 'Lábia'],
    ],
  },
  {
    id: 'mental',
    label: 'Mentais',
    skills: [
      ['academics', 'Acadêmicos'],
      ['awareness', 'Prontidão'],
      ['finance', 'Finanças'],
      ['investigation', 'Investigação'],
      ['medicine', 'Medicina'],
      ['occult', 'Ocultismo'],
      ['politics', 'Política'],
      ['science', 'Ciência'],
      ['technology', 'Tecnologia'],
    ],
  },
]);

function createRatings(groups, key, initialValue) {
  return Object.fromEntries(
    groups.flatMap((group) =>
      group[key].map((trait) => [Array.isArray(trait) ? trait[0] : trait.id, initialValue]),
    ),
  );
}

export const EMPTY_VAMPIRE_CHARACTER = Object.freeze({
  identity: {
    name: '',
    concept: '',
    predator: '',
    chronicle: '',
    ambition: '',
    clan: '',
    sire: '',
    desire: '',
    generation: '',
  },
  attributes: createRatings(ATTRIBUTE_GROUPS, 'traits', 1),
  skills: createRatings(SKILL_GROUPS, 'skills', 0),
  disciplines: [
    { id: 'discipline-1', name: '', rating: 0, powers: '' },
  ],
  resonance: '',
  humanity: 7,
  hunger: 1,
  healthDamage: [],
  willpowerDamage: [],
});

