/* ============================================================================
   SHOP POLICY — PENDING CLIENT CONFIRMATION (Luis)
   Three business decisions are still Luis's to make. Nothing below (or in
   the per-book `price` fields) may be changed until he confirms. Each
   decision maps to exactly ONE place to edit when his answer arrives:

   #1 PRICING — which title(s) change price, if any.
      → edit the `price` field on each book above (single source; every
        card, book page, basket line, checkout total and the mobile buy
        bar all read it automatically).
   #2 FREE SHIPPING — which specific titles qualify.
      → edit `SHOP.freeShippingThreshold` / add per-title rules here;
        StoreContext and the basket drawer both consume this object.
   #3 BUY-BUTTON PLACEMENT — where the cart/buy CTA sits on each page.
      → current placement follows the established WooCommerce convention
        (purchase box on every book page + sticky mobile bar); move the
        `<AddToCart>` usages / the sticky bar in BookDetail when decided.

   Current values preserve the previous shop behaviour — no guessing.
   ========================================================================== */
export const SHOP = {
  freeShippingThreshold: 30, // € — pending decision #2
  flatShipping: 3.95, // € — mainland Spain
};

/* ============================================================================
   LÁGRIMAS SALADAS TRILOGY — READING ORDER (PENDING CLIENT CONFIRMATION)
   null  → the three volumes are presented UNNUMBERED (current requirement).
   To activate the confirmed order, list the slugs in reading order, e.g.:
     ["lagrimas-saladas", "el-arbol-de-la-memoria", "volver-tras-mis-pasos"]
   The series page + volume cross-links pick it up automatically and only
   then display volume numbers. No other code changes needed.
   ========================================================================== */
export const SERIES_ORDER = null;

/* ============================================================================
   HOMEPAGE STATISTICS — verified figures only (client rule: never invent).
     works            → catalogue count (7 titles)
     pages            → derived: sum of catalogue page counts
     goodreadsReviews → client-provided (trilogy Goodreads reviews)
     trilogyVolumes   → catalogue count
   Update here when Luis provides official figures.
   ========================================================================== */
export const HOME_STATS = {
  works: 7,
  pages: 2146,
  goodreadsReviews: 87,
  trilogyVolumes: 3,
};

/**
 * Secondary discovery channels. Amazon listings are a "trampolín" toward this
 * shop (Amazon TOS forbid linking out from a product listing, so the bridge is
 * built via Author Central, Goodreads and social instead). Goodreads links are
 * deliberately real outbound links — the client treats Goodreads as a pool of
 * engaged buyers.
 */
export const externalLinks = (p) => ({
  amazon:
    p.amazon ??
    `https://www.amazon.es/s?k=${encodeURIComponent(`${p.title} Luis Caparrós`)}`,
  goodreads: `https://www.goodreads.com/search?q=${encodeURIComponent(
    `${p.title} Luis Caparrós`
  )}`,
});

export const AUTHOR = {
  name: "Luis Caparrós",
  full: "Luis Caparrós Mirón",
  role: "Writer",
  place: "Andalusia",
  instagram: "https://www.instagram.com/luis.caparrosmiron",
  facebook: "https://www.facebook.com/caparrosmiron",
  goodreads: "https://www.goodreads.com/search?q=Luis%20Caparr%C3%B3s%20Mir%C3%B3n",
  email: "contacto@luiscaparrosescritor.com",
};

export const NAV = [
  { key: "home", to: "/" },
  { key: "bio", to: "/biography" },
  { key: "books", to: "/books", dropdown: true },
  { key: "store", to: "/store" },
  { key: "contact", to: "/contact" },
];

export const LEGAL = [
  { key: "accessibility", to: "/accessibility" },
  { key: "legalNotice", to: "/legal-notice" },
  { key: "cookies", to: "/cookie-policy" },
  { key: "privacy", to: "/privacy-policy" },
];

export const BOOKS = [
  // 1. 2016 - Salty Tears (Lágrimas Saladas)
  {
    id: "lagrimas-saladas",
    slug: "lagrimas-saladas",
    kind: "book",
    title: "Lágrimas Saladas",
    titleEn: "Salty Tears",
    subtitle: { en: "The Lágrimas Saladas Trilogy", es: "La Trilogía Lágrimas Saladas" },
    year: 2016,
    genre: { en: "Novel", es: "Novela" },
    pages: 268,
    price: 14.99,
    cover: {
      bg: "linear-gradient(165deg,#173a45 0%,#0f2b35 55%,#0a1d24 100%)",
      accent: "#7fb7a8",
      text: "#eaf2ee",
      motif: "sea",
    },
    blurb: {
      en: "The sea as witness to every farewell: a story of emigration, salt and longing.",
      es: "El mar como testigo de las despedidas: una historia de emigración, sal y nostalgia.",
    },
    description: {
      en: [
        "Lágrimas Saladas is born facing the sea, where entire generations said goodbye without knowing if there would be a return. Through several interwoven voices, the novel reconstructs the emigration of the southern villages — overseas and toward the cities of the north.",
        "Each chapter moves with the rhythm of a tide: it advances, withdraws, and leaves on the sand objects, letters and promises that time cannot erase. It is a tribute to the mothers who waited on the docks and to the children who learned to love a land they barely knew.",
        "One of the three volumes of the Lágrimas Saladas Trilogy, it opens the emotional territory the whole cycle travels: salt, absence and the stubborn will to remember.",
      ],
      es: [
        "Lágrimas Saladas nace frente al mar, allí donde generaciones enteras se despidieron sin saber si habría regreso. A través de varias voces entrelazadas, la novela reconstruye la emigración de los pueblos del sur hacia ultramar y hacia las ciudades del norte.",
        "Cada capítulo tiene el ritmo de una marea: avanza, se retira y deja sobre la arena objetos, cartas y promesas que el tiempo no consigue borrar. Es un homenaje a las madres que esperaron en los muelles y a los hijos que aprendieron a amar una tierra que apenas conocieron.",
        "Uno de los tres volúmenes de la Trilogía Lágrimas Saladas, abre el territorio emocional que recorre el ciclo entero: la sal, la ausencia y la voluntad obstinada de recordar.",
      ],
    },
    quote: {
      en: "Whoever has wept facing the sea knows that salt is also inherited.",
      es: "Quien ha llorado frente al mar sabe que la sal también se hereda.",
    },
    details: [
      { label: { en: "Publisher", es: "Editorial" }, value: "Círculo Rojo" },
      { label: { en: "Format", es: "Formato" }, value: "14 × 21 cm" },
      { label: { en: "Pages", es: "Páginas" }, value: "268" },
      { label: { en: "Year", es: "Año" }, value: "2016" },
      { label: { en: "Language", es: "Idioma" }, value: "Español" },
    ],
    tags: [
      { en: "emigration", es: "emigración" },
      { en: "sea", es: "mar" },
      { en: "trilogy", es: "trilogía" },
    ],
    featured: true,
    trilogy: true,
    stock: 31,
  },

  // 2. 2017 - The Tree of Memory (El Árbol de la Memoria)
  {
    id: "el-arbol-de-la-memoria",
    slug: "el-arbol-de-la-memoria",
    kind: "book",
    title: "El Árbol de la Memoria",
    titleEn: "The Tree of Memory",
    subtitle: { en: "The Lágrimas Saladas Trilogy", es: "La Trilogía Lágrimas Saladas" },
    year: 2017,
    genre: { en: "Novel", es: "Novela" },
    pages: 302,
    price: 19.99,
    cover: {
      bg: "linear-gradient(160deg,#3c4a2f 0%,#2b3823 52%,#1c2517 100%)",
      accent: "#c8a24a",
      text: "#f2edd8",
      motif: "tree",
    },
    blurb: {
      en: "Under an old olive tree lie three generations of secrets, letters and roots.",
      es: "Bajo un viejo olivo se guardan tres generaciones de secretos, cartas y raíces.",
    },
    description: {
      en: [
        "In the courtyard of a village house grows a century-old olive tree under which every important decision of one family has been taken: weddings, mournings, silences and confessions. When the house is about to be sold, the grandchildren return to empty it and discover a box of letters nobody had ever read.",
        "El Árbol de la Memoria is a novel about the invisible inheritance passed from generation to generation: the gestures, the unspoken words and the affections that never learned to say themselves. Each chapter is a branch returning to the common trunk.",
        "One of the three volumes of the Lágrimas Saladas Trilogy, it deepens the question running through all of them: what remains of us when memory begins to fail.",
      ],
      es: [
        "En el patio de una casa de pueblo crece un olivo centenario bajo el que se han tomado todas las decisiones importantes de una familia: bodas, duelos, silencios y confesiones. Cuando la casa va a venderse, los nietos regresan para vaciarla y descubren una caja de cartas que nadie había leído.",
        "El Árbol de la Memoria es una novela sobre la herencia invisible que pasa de generación en generación: los gestos, las palabras calladas y los afectos que no supieron decirse. Cada capítulo es una rama que vuelve al tronco común.",
        "Uno de los tres volúmenes de la Trilogía Lágrimas Saladas, profundiza en la pregunta que recorre las tres obras: qué queda de nosotros cuando la memoria empieza a fallar.",
      ],
    },
    quote: {
      en: "Roots are not seen, but they are what hold up every farewell.",
      es: "Las raíces no se ven, pero son las que sostienen todas las despedidas.",
    },
    details: [
      { label: { en: "Publisher", es: "Editorial" }, value: "Círculo Rojo" },
      { label: { en: "Format", es: "Formato" }, value: "14 × 21 cm" },
      { label: { en: "Pages", es: "Páginas" }, value: "302" },
      { label: { en: "Year", es: "Año" }, value: "2017" },
      { label: { en: "Language", es: "Idioma" }, value: "Español" },
    ],
    tags: [
      { en: "family", es: "familia" },
      { en: "memory", es: "memoria" },
      { en: "trilogy", es: "trilogía" },
    ],
    featured: true,
    trilogy: true,
    stock: 27,
  },

  // 3. 2018 - Returning in My Footsteps (Volver tras mis Pasos)
  {
    id: "volver-tras-mis-pasos",
    slug: "volver-tras-mis-pasos",
    kind: "book",
    title: "Volver tras mis Pasos",
    titleEn: "Returning in My Footsteps",
    subtitle: { en: "The Lágrimas Saladas Trilogy", es: "La Trilogía Lágrimas Saladas" },
    year: 2018,
    genre: { en: "Autobiographical novel", es: "Novela autobiográfica" },
    pages: 284,
    price: 19.99,
    cover: {
      bg: "linear-gradient(160deg,#4a3b2c 0%,#362b20 55%,#221b14 100%)",
      accent: "#d08b4c",
      text: "#f3e9d7",
      motif: "path",
    },
    blurb: {
      en: "The return to the home village turned inner journey: memory, road and forgiveness.",
      es: "El regreso al pueblo natal convertido en viaje interior: memoria, camino y perdón.",
    },
    description: {
      en: [
        "Volver tras mis Pasos belongs to the Lágrimas Saladas Trilogy and follows the narrator's return to the village where he was born. The road back is not only geographical: every bend reopens an unfinished conversation, a face, an emotional debt.",
        "In a confessional, serene tone, the novel travels the landscapes of childhood — the school, the threshing floor, the shuttered house — and sets them against the man time has made of the boy who left. There is no easy nostalgia here: there is truth, humour and a search for reconciliation.",
        "A work about forgiveness — the kind one asks for and the kind one grants — and about the idea that only those who learn to look back without resentment truly return.",
      ],
      es: [
        "Volver tras mis Pasos forma parte de la Trilogía Lágrimas Saladas y sigue el regreso del narrador al pueblo que lo vio nacer. El camino de vuelta no es solo geográfico: cada curva del sendero reabre una conversación pendiente, un rostro, una deuda afectiva.",
        "Con un tono confesional y sereno, la novela recorre los paisajes de la infancia —la escuela, la era, la casa cerrada— y los confronta con el hombre que el tiempo ha hecho del niño que se fue. No hay nostalgia amable: hay verdad, humor y una búsqueda de reconciliación.",
        "Una obra sobre el perdón —el que se pide y el que se concede— y sobre la idea de que solo vuelve de verdad quien aprende a mirar atrás sin rencor.",
      ],
    },
    quote: {
      en: "You do not return to a place: you return to the person you were in it.",
      es: "No se vuelve al lugar: se vuelve a la persona que fuimos en él.",
    },
    details: [
      { label: { en: "Publisher", es: "Editorial" }, value: "Círculo Rojo" },
      { label: { en: "Format", es: "Formato" }, value: "14 × 21 cm" },
      { label: { en: "Pages", es: "Páginas" }, value: "284" },
      { label: { en: "Year", es: "Año" }, value: "2018" },
      { label: { en: "Language", es: "Idioma" }, value: "Español" },
    ],
    tags: [
      { en: "autobiographical", es: "autobiográfico" },
      { en: "return", es: "regreso" },
      { en: "trilogy", es: "trilogía" },
    ],
    featured: true,
    trilogy: true,
    stock: 19,
  },

  // 4. 2019 - Lucía la Romi Lorquina (Lucía. The Lorca Roma)
  {
    id: "lucia-la-romi-lorquina",
    slug: "lucia-la-romi-lorquina",
    kind: "book",
    title: "Lucía la Romi Lorquina",
    titleEn: "Lucía. The Lorca Roma",
    subtitle: { en: "Novel", es: "Novela" },
    year: 2019,
    genre: { en: "Novel", es: "Novela" },
    pages: 318,
    price: 23.99,
    cover: {
      bg: "linear-gradient(160deg,#54171f 0%,#3b1116 55%,#250b0e 100%)",
      accent: "#e0b04c",
      text: "#f5e8d3",
      motif: "fan",
    },
    blurb: {
      en: "The portrait of a free woman on the roads of Spain: song, dignity and roots.",
      es: "El retrato de una mujer libre en la España de los caminos: cante, dignidad y raíz.",
    },
    description: {
      en: [
        "Lucía la Romi Lorquina draws the portrait of a woman who refused to live with her head bowed. Between fairs, inns and dusty roads, Lucía earns her living with her singing and with a wisdom she never learned from any book.",
        "The novel travels the popular culture of the south: flamenco as a mother tongue, chosen family, prejudice and the dignity of the Roma villages. Caparrós builds a luminous character, full of humour and scars, who sings so as not to have to explain herself.",
        "A tribute to the women who carry both the feast and the mourning with the same steadiness, and to a deep Andalusia that literature too rarely looks squarely in the face.",
      ],
      es: [
        "Lucía la Romi Lorquina dibuja el retrato de una mujer que se negó a vivir con la cabeza baja. Entre ferias, ventas y caminos de polvo, Lucía se gana la vida con su cante y con una sabiduría que no aprendió en ningún libro.",
        "La novela recorre la cultura popular del sur: el flamenco como lengua materna, la familia elegida, el prejuicio y la dignidad de los pueblos gitanos. Caparrós construye un personaje luminoso, lleno de humor y de cicatrices, que canta para no tener que explicarse.",
        "Un homenaje a las mujeres que sostienen la fiesta y el duelo con la misma entereza, y a una Andalucía profunda que la literatura pocas veces mira de frente.",
      ],
    },
    quote: {
      en: "She sang the way one lights a fire: so that nobody would be cold.",
      es: "Cantaba como quien enciende una lumbre: para que nadie pasara frío.",
    },
    details: [
      { label: { en: "Publisher", es: "Editorial" }, value: "Círculo Rojo" },
      { label: { en: "Format", es: "Formato" }, value: "15 × 23 cm" },
      { label: { en: "Pages", es: "Páginas" }, value: "318" },
      { label: { en: "Year", es: "Año" }, value: "2019" },
      { label: { en: "Language", es: "Idioma" }, value: "Español" },
    ],
    tags: [
      { en: "flamenco", es: "flamenco" },
      { en: "women", es: "mujer" },
      { en: "andalusia", es: "andalucía" },
    ],
    featured: true,
    stock: 22,
  },

  // 5. 2020 - Sueños y Recuerdos de un Maestro de Escuela
  {
    id: "suenos-y-recuerdos-de-un-maestro-de-escuela",
    slug: "suenos-y-recuerdos-de-un-maestro-de-escuela",
    kind: "book",
    title: "Sueños y Recuerdos de un Maestro de Escuela",
    titleEn: "Dreams and Memories of a Schoolteacher",
    subtitle: { en: "Memoir", es: "Memorias" },
    year: 2020,
    genre: { en: "Memoir", es: "Memorias" },
    pages: 246,
    price: 23.99,
    cover: {
      bg: "linear-gradient(160deg,#2e4038 0%,#22312b 55%,#161f1b 100%)",
      accent: "#e8e2cc",
      text: "#f0eddc",
      motif: "chalk",
    },
    blurb: {
      en: "Forty years of blackboard: the rural school told by the man who made it possible.",
      es: "Cuarenta años de pizarra: la escuela rural contada por quien la hizo posible.",
    },
    description: {
      en: [
        "Sueños y Recuerdos de un Maestro de Escuela gathers the memoirs of a whole life devoted to teaching in rural classrooms. Chalk, the brazier, squared notebooks and the dirt roads the pupils walked in from make up the landscape of these pages.",
        "Each memory is also a reflection on the craft of teaching: what it means to awaken a child's curiosity, what one learns from the parents at the school door, and what remains of a lesson thirty years later.",
        "A tender, luminous book, written like a conversation by the stove, that is at once a tribute to teachers and a defence of public schooling.",
      ],
      es: [
        "Sueños y Recuerdos de un Maestro de Escuela reúne las memorias de toda una vida dedicada a enseñar en las aulas rurales. La tiza, el brasero, los cuadernos de cuadrícula y los caminos de tierra por los que llegaban los alumnos forman el paisaje de estas páginas.",
        "Cada recuerdo es también una reflexión sobre el oficio de enseñar: qué significa despertar la curiosidad de un niño, qué se aprende de los padres en la puerta de la escuela y qué queda de una lección treinta años después.",
        "Un libro tierno y luminoso, escrito como una conversación al calor de la estufa, que es a la vez homenaje a los maestros y defensa de la escuela pública.",
      ],
    },
    quote: {
      en: "Teaching is not filling a glass: it is lighting a lamp meant to last a lifetime.",
      es: "Enseñar no es llenar un vaso: es encender una lámpara que dure toda la vida.",
    },
    details: [
      { label: { en: "Publisher", es: "Editorial" }, value: "Círculo Rojo" },
      { label: { en: "Format", es: "Formato" }, value: "14 × 21 cm" },
      { label: { en: "Pages", es: "Páginas" }, value: "246" },
      { label: { en: "Year", es: "Año" }, value: "2020" },
      { label: { en: "Language", es: "Idioma" }, value: "Español" },
    ],
    tags: [
      { en: "rural school", es: "escuela rural" },
      { en: "memoir", es: "memorias" },
      { en: "education", es: "educación" },
    ],
    featured: true,
    stock: 35,
  },

  // 6. 2022 - Urbanismo, más allá de la razón: Ella, libertad
  {
    id: "urbanismo-mas-alla-de-la-razon",
    slug: "urbanismo-mas-alla-de-la-razon",
    kind: "book",
    title: "Urbanismo, más allá de la razón: Ella, libertad",
    titleEn: "She, Liberty. Urbanism Beyond Reason",
    subtitle: { en: "Essay", es: "Ensayo" },
    year: 2022,
    genre: { en: "Essay", es: "Ensayo" },
    pages: 342,
    price: 23.99,
    amazon: "https://a.co/d/0cKmaheh",
    cover: {
      bg: "linear-gradient(150deg,#2f3540 0%,#232833 55%,#171b23 100%)",
      accent: "#d97b32",
      text: "#edeae0",
      motif: "city",
    },
    blurb: {
      en: "A novel of the Spanish housing bubble (2007–2014): a town swallowed by speculation, and the people who refused to be set in concrete.",
      es: "Una novela de la burbuja inmobiliaria (2007–2014): un pueblo engullido por la especulación y las personas que se negaron a ser hormigonadas.",
    },
    description: {
      en: [
        "Urbanismo, más allá de la razón: Ella, libertad is a novel set in the years of the Spanish housing bubble, between 2007 and 2014, when cranes outnumbered bell towers and every field had a price before it had a name. A quiet inland town watches its streets become promotional renders and its neighbours become signatures.",
        "Through a chorus of characters — the friends tempted by easy money, the widow who will not sell, the planner who stopped believing in plans — the novel follows the fever of speculation and the hangover that came after: empty developments, broken promises and the question of what a town owes to the people who made it.",
        "Written with the author's trademark tenderness and bite, it is a story about land, greed and freedom — and about the courage it takes to stay when everything around you is being sold.",
      ],
      es: [
        "Urbanismo, más allá de la razón: Ella, libertad es una novela ambientada en los años de la burbuja inmobiliaria española, entre 2007 y 2014, cuando había más grúas que campanarios y cada campo tenía precio antes que nombre. Un pueblo tranquilo del interior ve cómo sus calles se vuelven renders promocionales y sus vecinos, firmas en un contrato.",
        "A través de un coro de personajes —los amigos tentados por el dinero fácil, la viuda que no vende, el técnico que dejó de creer en los planes— la novela sigue la fiebre de la especulación y la resaca que vino después: urbanizaciones vacías, promesas rotas y la pregunta de qué le debe un pueblo a quienes lo hicieron.",
        "Escrita con la ternura y el mordiente propios del autor, es una historia sobre la tierra, la codicia y la libertad —y sobre el valor que hace falta para quedarse cuando todo alrededor se está vendiendo.",
      ],
    },
    quote: {
      en: "They put a price on the land, but they never found the column for what it held up.",
      es: "Le pusieron precio a la tierra, pero no encontraron columna donde apuntar lo que sostenía.",
    },
    details: [
      { label: { en: "Publisher", es: "Editorial" }, value: "Círculo Rojo" },
      { label: { en: "Format", es: "Formato" }, value: "16 × 24 cm" },
      { label: { en: "Pages", es: "Páginas" }, value: "342" },
      { label: { en: "Year", es: "Año" }, value: "2022" },
      { label: { en: "Language", es: "Idioma" }, value: "Español" },
    ],
    tags: [
      { en: "housing bubble", es: "burbuja inmobiliaria" },
      { en: "speculation", es: "especulación" },
      { en: "essay", es: "ensayo" },
    ],
    stock: 16,
  },

  // 7. 2024 - Hijas del Viento (Daughters of the Wind)
  {
    id: "hijas-del-viento",
    slug: "hijas-del-viento",
    kind: "book",
    title: "Hijas del Viento",
    titleEn: "Daughters of the Wind",
    subtitle: { en: "Novel", es: "Novela" },
    year: 2024,
    genre: { en: "Spanish Civil War novel", es: "Novela de la Guerra Civil" },
    pages: 386,
    price: 23.99,
    cover: {
      bg: "linear-gradient(160deg,#33414d 0%,#1d2a33 46%,#141d23 100%)",
      accent: "#c96b4a",
      text: "#f0e7d6",
      motif: "wind",
    },
    blurb: {
      en: "A novel of the Spanish Civil War and its aftermath, told through the voices of those who suffered it in silence.",
      es: "Una novela de la Guerra Civil española y su posguerra, contada desde la voz de quienes la sufrieron en silencio.",
    },
    description: {
      en: [
        "Hijas del Viento crosses the Spanish Civil War and the difficult years that followed, through the memory of those who were forced into silence. Manuela, its protagonist, learns to hold herself upright in a country split in two, where repression, fear and loss seep into every gesture of daily life.",
        "Driven by love, dignity and a hope that refuses to go out, her story gathers the echo of so many families marked by injustice, exile and waiting. Luis Caparrós writes in moving, committed prose, giving a voice to those still seeking truth and repair.",
        "A novel about the courage of the women who held homes together when everything was falling apart, and about memory as the only territory where the absent remain alive.",
      ],
      es: [
        "Hijas del Viento atraviesa la Guerra Civil española y los años difíciles que siguieron, siguiendo la memoria de quienes fueron obligados a callar. Manuela, su protagonista, aprende a sostenerse en un país partido en dos, donde la represión, el miedo y la pérdida se filtran en cada gesto de la vida cotidiana.",
        "Empujada por el amor, la dignidad y una esperanza que se niega a apagarse, su historia recoge el eco de tantas familias marcadas por la injusticia, el exilio y la espera. Luis Caparrós escribe con una prosa emocionada y comprometida, dando voz a quienes todavía buscan verdad y reparación.",
        "Una novela sobre la valentía de las mujeres que sostuvieron los hogares cuando todo se derrumbaba, y sobre la memoria como único territorio donde los ausentes siguen vivos.",
      ],
    },
    quote: {
      en: "The wind carried the words away, but it could not carry away the memory.",
      es: "El viento se llevaba las palabras, pero no pudo llevarse la memoria.",
    },
    details: [
      { label: { en: "Publisher", es: "Editorial" }, value: "Círculo Rojo" },
      { label: { en: "Format", es: "Formato" }, value: "15 × 23 cm" },
      { label: { en: "Pages", es: "Páginas" }, value: "386" },
      { label: { en: "Year", es: "Año" }, value: "2024" },
      { label: { en: "Language", es: "Idioma" }, value: "Español" },
    ],
    tags: [
      { en: "civil war", es: "guerra civil" },
      { en: "historical fiction", es: "novela histórica" },
      { en: "postwar", es: "posguerra" },
      { en: "historical memory", es: "memoria histórica" },
    ],
    featured: true,
    isNew: true,
    stock: 24,
  },
];

export const OIL = {
  id: "evo-own-harvest",
  slug: "evo-own-harvest",
  kind: "oil",
  title: "Aceite de Oliva Virgen Extra — Cosecha Propia",
  subtitle: { en: "First cold pressing · 500 ml", es: "Primera prensada en frío · 500 ml" },
  year: 2025,
  genre: { en: "Family olive mill", es: "Almazara familiar" },
  price: 12.5,
  oldPrice: 15,
  cover: {
    bg: "linear-gradient(160deg,#37452b 0%,#28341f 55%,#1a2314 100%)",
    accent: "#c8a24a",
    text: "#f2edd8",
    motif: "tree",
  },
  blurb: {
    en: "From the family olive grove to your table: green, fruity and honest, the way it has always been.",
    es: "Del olivar de la familia a tu mesa: verde, frutado y honesto, como toda la vida.",
  },
  description: {
    en: [
      "This oil comes from the same olive grove that appears in the pages of my books. Picked at veraison and cold-pressed the very same day, it keeps the intense green, the noble bitterness and the exact pepperiness of sound olives.",
      "Each 500 ml bottle carries the harvest of a single estate and a single variety. It is not just another product in the shop: it is the land that sustains the literature.",
    ],
    es: [
      "Este aceite nace del mismo olivar que aparece en las páginas de mis libros. Recogido en envero y molturado en frío el mismo día, conserva el verde intenso, el amargor noble y el picor justo de la aceituna sana.",
      "Cada botella de 500 ml lleva la cosecha de una sola finca y una sola variedad. No es un producto más de la tienda: es la tierra que sostiene la literatura.",
    ],
  },
  details: [
    { label: { en: "Format", es: "Formato" }, value: "500 ml" },
    { label: { en: "Variety", es: "Variedad" }, value: "Picual" },
    { label: { en: "Extraction", es: "Extracción" }, value: "Cold pressed" },
    { label: { en: "Harvest", es: "Cosecha" }, value: "2025 / 2026" },
    { label: { en: "Origin", es: "Origen" }, value: "Andalusia" },
  ],
  tags: [
    { en: "EVOO", es: "AOVE" },
    { en: "olive grove", es: "olivar" },
    { en: "local", es: "kilómetro cero" },
  ],
  stock: 40,
};

export const ALL_PRODUCTS = [...BOOKS, OIL];

export const TRILOGY = BOOKS.filter((b) => b.trilogy);
export const LATEST = BOOKS.find((b) => b.isNew) ?? BOOKS[0];

export const bySlug = (slug) => ALL_PRODUCTS.find((p) => p.slug === slug);

export const formatPrice = (n) =>
  n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";