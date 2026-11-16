export const PEOPLE = ['Peter', 'Klaudia', 'Niki', 'Meli', 'Philipp', 'Sabsi'] as const
export type Person = (typeof PEOPLE)[number]

type Character = {
  /** Portrait, square, at least 512px. Drop the file into /public/characters/ */
  image: string
  /** Personal elf greeting (ElevenLabs). Drop the file into /public/characters/ */
  audio: string
  /** Shown as subtitle while the greeting plays */
  greeting: string
}

const file = (p: Person) => p.toLowerCase()

export const CHARACTERS: Record<Person, Character> = Object.fromEntries(
  PEOPLE.map((p) => [p, { image: `/characters/${file(p)}.webp`, audio: `/characters/${file(p)}.mp3`, greeting: '' }]),
) as Record<Person, Character>

CHARACTERS.Peter.greeting = 'Na servas, Peter! Warst eh brav heuer? Dann drah amal am Radl!'
CHARACTERS.Klaudia.greeting = 'Griaß di, Klaudia! Heuer hast da a Packerl verdient – jetzt bist du dran!'
CHARACTERS.Niki.greeting = 'Ja servus, Niki! Na, wen erwischt denn du heuer? Auf geht’s!'
CHARACTERS.Meli.greeting = 'Hallo Meli! I hob scho auf di gwartet. Schau ma, wen du beschenkst!'
CHARACTERS.Philipp.greeting = 'Ah, der Philipp! Mit dir hob i heuer was Besonderes vor. Drah amal!'
CHARACTERS.Sabsi.greeting = 'Servas Sabsi! Des Radl wartet scho auf di. Viel Glück!'
