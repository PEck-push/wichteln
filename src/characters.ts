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

// Greeting lines spoken by the elf (ElevenLabs voice "Wichtel vom Dienst"), Austrian dialect.
CHARACTERS.Peter.greeting = 'Na servas, Peter! Woast eh brav heuer? Daun drah amoal am Radl!'
CHARACTERS.Klaudia.greeting = 'Griaß di, Klautschi! Heuer host da a Packerl vadient – aber jetzt bist amoal du draun!'
CHARACTERS.Niki.greeting = 'Ja servus, Niki! Na, wen dawischt denn du heuer? Auf geht’s!'
CHARACTERS.Meli.greeting = 'Hallo Meli! I hob scho auf di gwoat. Schau ma, wen du beschenkst!'
CHARACTERS.Philipp.greeting = 'Ah, da Philipp! Mit dir hob i heuer wos Bsondas vor. Drah amoal!'
CHARACTERS.Sabsi.greeting = 'Servas, Sabsi! Des Radl woat scho auf di. Vü Glück!'

/* Previous version (kept for reference):
CHARACTERS.Peter.greeting = 'Na servas, Peter! Warst eh brav heuer? Dann drah amal am Radl!'
CHARACTERS.Klaudia.greeting = 'Griaß di, Klaudia! Heuer hast da a Packerl verdient – jetzt bist du dran!'
CHARACTERS.Niki.greeting = 'Ja servus, Niki! Na, wen erwischt denn du heuer? Auf geht’s!'
CHARACTERS.Meli.greeting = 'Hallo Meli! I hob scho auf di gwartet. Schau ma, wen du beschenkst!'
CHARACTERS.Philipp.greeting = 'Ah, der Philipp! Mit dir hob i heuer was Besonderes vor. Drah amal!'
CHARACTERS.Sabsi.greeting = 'Servas Sabsi! Des Radl wartet scho auf di. Viel Glück!'
*/
