export const RPG_SYSTEMS = Object.freeze([
  {
    id: 'vampire-v5',
    name: 'Vampiro 5ED',
    path: '/vampire',
    universe: 'Mundo das Trevas',
    description:
      'Crie vampiros, registre disciplinas e acompanhe sua fome nas noites da cidade.',
  },
  {
    id: 'dnd-5e',
    name: 'D&D 5ED',
    path: '/dashboard',
    universe: 'Fantasia heroica',
    description:
      'Organize aventureiros, atributos, perícias e recursos para sua próxima jornada.',
  },
]);

export function getSystemById(systemId) {
  return RPG_SYSTEMS.find((system) => system.id === systemId) ?? null;
}
