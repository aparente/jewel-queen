/**
 * Jewel Queen — 100% Real Museum-Photographed Antique & Vintage Jewelry
 * Curated from the Victoria & Albert Museum (V&A) and Cleveland Museum of Art (CC0)
 * across 8 Historical Era + Style Exhibitions inspired by Connie Parente's taste.
 */

export const BOARD_SIZE = 7;

export const JEWELS = [
  // Stage 1: Art Nouveau & Belle Époque (1900s–1915)
  {
    id: 'lalique-medusa',
    name: 'Blue Enamel Medusa Pendant',
    shortName: 'Lalique Medusa',
    img: 'assets/museum_jewels/lalique-medusa.png',
    color: '#60a5fa',
    glow: 'rgba(96, 165, 250, 0.82)',
    spark: '#bfdbfe',
    era: 'ca. 1899 · Art Nouveau',
    designers: 'René Lalique · V&A Museum',
    provenance: 'Sculpted gold and opalescent sky-blue enamel serpent-hair pendant by Art Nouveau master René Lalique.'
  },
  {
    id: 'marcus-opal',
    name: 'Black Opal & Enamel Brooch',
    shortName: 'Marcus Opal',
    img: 'assets/museum_jewels/marcus-opal.png',
    color: '#14b8a6',
    glow: 'rgba(45, 212, 191, 0.84)',
    spark: '#99f6e4',
    era: 'ca. 1900 · Art Nouveau',
    designers: 'Marcus & Co. · V&A Museum',
    provenance: 'Fiery iridescent blue-green opal cradled in plique-à-jour botanical green and cobalt enamel.'
  },
  {
    id: 'lalique-gold',
    name: 'Crimson & Gold Enamel Brooch',
    shortName: 'Lalique Flame',
    img: 'assets/museum_jewels/lalique-gold.png',
    color: '#f59e0b',
    glow: 'rgba(251, 191, 36, 0.82)',
    spark: '#fde68a',
    era: '1904–1906 · Art Nouveau',
    designers: 'René Lalique · V&A Museum',
    provenance: 'Luminous translucent sunset-gold and crimson enamel fan brooch set with deep cabochon accents.'
  },
  {
    id: 'nouveau-pearl',
    name: 'Art Nouveau Pearl & Emerald Brooch',
    shortName: 'Pearl Crest',
    img: 'assets/museum_jewels/nouveau-pearl.png',
    color: '#f5ead6',
    glow: 'rgba(255, 245, 224, 0.82)',
    spark: '#ffffff',
    era: 'ca. 1900 · Belle Époque',
    designers: 'Art Nouveau Atelier · V&A Museum',
    provenance: 'Swirling whiplash yellow gold adorned with luminous baroque pearl drops and tiny emerald accents.'
  },
  {
    id: 'child-amethyst',
    name: 'Green Enamel & Amethyst Brooch',
    shortName: 'Enamel Amethyst',
    img: 'assets/museum_jewels/child-amethyst.png',
    color: '#a855f7',
    glow: 'rgba(192, 132, 252, 0.84)',
    spark: '#e9d5ff',
    era: 'ca. 1900 · Arts & Crafts / Nouveau',
    designers: 'Child & Child · V&A Museum',
    provenance: 'Rich imperial oval amethyst framed in vivid translucent emerald-green enamel with a dangling baroque pearl.'
  },

  // Stage 2: 1920s–30s Art Deco · Chinoiserie & Flower Basket
  {
    id: 'chinese-jade',
    name: 'Carved Chinese Jade Dragon Ring',
    shortName: 'Jade Dragon',
    img: 'assets/museum_jewels/chinese-jade.png',
    color: '#86efac',
    glow: 'rgba(134, 239, 172, 0.8)',
    spark: '#dcfce7',
    era: 'Antique China · Chinoiserie Muse',
    designers: 'Chinese Jade Archive · V&A Museum',
    provenance: 'Archaic coiled jade dragon bi-ring — the exact ancient Chinese motif that sparked 1920s Parisian Art Deco Chinoiserie.'
  },
  {
    id: 'cartier-lapis',
    name: 'Carved Lapis & Diamond Fan Brooch',
    shortName: 'Cartier Lapis',
    img: 'assets/museum_jewels/cartier-lapis.png',
    color: '#2563eb',
    glow: 'rgba(59, 130, 246, 0.86)',
    spark: '#93c5fd',
    era: '1920–1930 · Art Deco',
    designers: 'Cartier · V&A Museum',
    provenance: 'Dazzling fluted royal-cobalt carved lapis lazuli fan accented with black onyx and sparkling platinum diamonds.'
  },
  {
    id: 'deco-coral-basket',
    name: 'Carved Coral Flower Basket Brooch',
    shortName: 'Coral Basket',
    img: 'assets/museum_jewels/deco-coral-basket.png',
    color: '#f97316',
    glow: 'rgba(251, 146, 60, 0.84)',
    spark: '#fed7aa',
    era: 'ca. 1925 · Art Deco Chinoiserie',
    designers: 'Parisian Deco Atelier · V&A Museum',
    provenance: 'Charming carved coral poppies and nephrite leaves blooming from a sparkling platinum-and-diamond basket.'
  },
  {
    id: 'cartier-lozenge',
    name: 'Diamond & Onyx Lozenge Brooch',
    shortName: 'Cartier Lozenge',
    img: 'assets/museum_jewels/cartier-lozenge.png',
    color: '#e2e8f0',
    glow: 'rgba(226, 232, 240, 0.84)',
    spark: '#ffffff',
    era: '1913–1925 · Early Art Deco',
    designers: 'Cartier · V&A Museum',
    provenance: 'Crisp geometric platinum filigree lozenge pierced with razor-sharp black onyx and old-cut diamonds.'
  },
  {
    id: 'deco-tutti-frutti',
    name: 'Art Deco Pearl & Gem Floral Brooch',
    shortName: 'Deco Floral',
    img: 'assets/museum_jewels/deco-tutti-frutti.png',
    color: '#f43f5e',
    glow: 'rgba(251, 113, 133, 0.82)',
    spark: '#fecdd3',
    era: '1920–1930 · Art Deco',
    designers: 'Art Deco Joaillier · V&A Museum',
    provenance: 'Sculptural baroque pearl blossom paired with stepped emerald, sapphire, ruby, and diamond Deco foliage.'
  },

  // Stage 3: Global Revival (Pre-Columbian, Mayan Deco, Egyptian, Berber)
  {
    id: 'precolumbian-gold',
    name: 'Pre-Columbian Gold Figure Pendant',
    shortName: 'Mayan Gold',
    img: 'assets/museum_jewels/precolumbian-gold.png',
    color: '#eab308',
    glow: 'rgba(250, 204, 21, 0.82)',
    spark: '#fef08a',
    era: 'c. 1000–1550 · Pre-Columbian Muse',
    designers: 'Veraguas Gold · Cleveland Museum CC0',
    provenance: 'Ancient cast-gold Mesoamerican & Isthmian figure pendant — the direct inspiration for 1920s–30s Mayan Revival jewelry.'
  },
  {
    id: 'deco-stepped',
    name: 'Stepped Coral & Onyx Deco Plaque',
    shortName: 'Mayan Plaque',
    img: 'assets/museum_jewels/deco-stepped.png',
    color: '#fb923c',
    glow: 'rgba(251, 146, 60, 0.84)',
    spark: '#ffedd5',
    era: '1920–1930 · Mayan Revival Deco',
    designers: 'Art Deco Atelier · V&A Museum',
    provenance: 'Geometric stepped coral-orange and black-onyx fretwork framed in diamonds and frosted moonstone endcaps.'
  },
  {
    id: 'castellani-scarab',
    name: 'Teal Egyptian Scarab Gold Brooch',
    shortName: 'Teal Scarab',
    img: 'assets/museum_jewels/castellani-scarab.png',
    color: '#0d9488',
    glow: 'rgba(45, 212, 191, 0.82)',
    spark: '#99f6e4',
    era: 'ca. 1858 · Archaeological Revival',
    designers: 'Castellani · V&A Museum',
    provenance: 'Carved deep teal-jade Egyptian scarab mounted in granulated antique Etruscan-revival gold by Castellani.'
  },
  {
    id: 'berber-coral',
    name: 'Enamel & Coral Talisman Fibula',
    shortName: 'Coral Talisman',
    img: 'assets/museum_jewels/berber-coral.png',
    color: '#ef4444',
    glow: 'rgba(248, 113, 113, 0.82)',
    spark: '#fecaca',
    era: '19th Century · Maghreb Silver',
    designers: 'North African Silver · V&A Museum',
    provenance: 'Opulent silver brooch inlaid with coral cabochons, cobalt & emerald cloisonné enamel, and dangling petal drops.'
  },
  {
    id: 'beetle-scarab',
    name: 'Egyptian Revival Giant Beetle Brooch',
    shortName: 'Obsidian Beetle',
    img: 'assets/museum_jewels/beetle-scarab.png',
    color: '#94a3b8',
    glow: 'rgba(203, 213, 225, 0.78)',
    spark: '#f1f5f9',
    era: 'ca. 1880 · Egyptian Revival',
    designers: 'Victorian Revival · V&A Museum',
    provenance: 'Bold, edgy sculptural stag-beetle scarab brooch celebrating Victorian and Deco fascination with ancient Egypt.'
  },

  // Stage 4: Surrealist, Bakelite & Hollywood Whimsy
  {
    id: 'cartier-hand',
    name: 'Coral Hand Holding Black Rose',
    shortName: 'Cartier Hand',
    img: 'assets/museum_jewels/cartier-hand.png',
    color: '#fb7185',
    glow: 'rgba(251, 113, 133, 0.84)',
    spark: '#fecdd3',
    era: '1930–1940 · Surrealist Couture',
    designers: 'Cartier · V&A Museum',
    provenance: 'Iconic weird-chic surrealist brooch: a carved pink coral hand with jeweled cuffs clutching a glossy black onyx & diamond rose.'
  },
  {
    id: 'flato-feet',
    name: 'Gold Feet with Ruby Toenails',
    shortName: 'Flato Feet',
    img: 'assets/museum_jewels/flato-feet.png',
    color: '#facc15',
    glow: 'rgba(250, 204, 21, 0.86)',
    spark: '#fef08a',
    era: '1940–1950 · Hollywood Whimsy',
    designers: 'Paul Flato · V&A Museum',
    provenance: 'Playful, witty pair of gleaming yellow-gold bare-feet dress clips manicured with ten pigeon-blood ruby toenails.'
  },
  {
    id: 'bakelite-oval',
    name: 'Tortoiseshell Bakelite Nested Oval',
    shortName: 'Bakelite Oval',
    img: 'assets/museum_jewels/bakelite-oval.png',
    color: '#d97706',
    glow: 'rgba(245, 158, 11, 0.82)',
    spark: '#fde68a',
    era: '1930s · Bakelite & Catalin Pop',
    designers: '1930s Plastics Atelier · V&A Museum',
    provenance: 'Glossy carved dark tortoiseshell and translucent honey-amber Bakelite rings linked in sculptural Machine-Age curves.'
  },
  {
    id: 'cartier-owl',
    name: 'Carved Moonstone & Turquoise Owl',
    shortName: 'Cartier Owl',
    img: 'assets/museum_jewels/cartier-owl.png',
    color: '#f8fafc',
    glow: 'rgba(248, 250, 252, 0.86)',
    spark: '#ffffff',
    era: 'ca. 1950 · Adorable Couture',
    designers: 'Cartier · V&A Museum',
    provenance: 'Endearing carved translucent white quartz & moonstone owl perched on a gold branch with glowing cabochon turquoise eyes.'
  },
  {
    id: 'dior-unicorn',
    name: 'Pavé Rhinestone Unicorn Head',
    shortName: 'Dior Unicorn',
    img: 'assets/museum_jewels/dior-unicorn.png',
    color: '#e2e8f0',
    glow: 'rgba(241, 245, 249, 0.88)',
    spark: '#ffffff',
    era: 'c. 1952 · Christian Dior Couture',
    designers: 'Christian Dior by Mitchel Maer · V&A Museum',
    provenance: 'Magical, sculptural white-rhinestone pavé unicorn head with antique gold mane — peak adorable Hollywood glamour.'
  },

  // Stage 5: 1940s–50s Golden Age Hollywood & Dior Couture
  {
    id: 'dior-amethyst',
    name: 'Cherubs & Amethyst Baroque Brooch',
    shortName: 'Dior Amethyst',
    img: 'assets/museum_jewels/dior-amethyst.png',
    color: '#9333ea',
    glow: 'rgba(192, 132, 252, 0.82)',
    spark: '#e9d5ff',
    era: '1952–1953 · Christian Dior Couture',
    designers: 'Christian Dior by Mitchel Maer · V&A Museum',
    provenance: 'Theatrical silvered cherubs hoisting a deep royal-purple cabochon amethyst framed in antique rhinestones.'
  },
  {
    id: 'peacock-1940s',
    name: 'Jeweled Sapphire & Gold Peacock',
    shortName: 'Gold Peacock',
    img: 'assets/museum_jewels/peacock-1940s.png',
    color: '#3b82f6',
    glow: 'rgba(96, 165, 250, 0.84)',
    spark: '#bfdbfe',
    era: '1940–1950 · Retro Hollywood',
    designers: '1940s Haute Joaillerie · V&A Museum',
    provenance: 'Sweeping gold-plume peacock encrusted with sapphires, emeralds, rubies, and a tiny diamond crown.'
  },
  {
    id: 'trifari-plume',
    name: 'Gold & Rhinestone Plume Brooch',
    shortName: 'Trifari Plume',
    img: 'assets/museum_jewels/trifari-plume.png',
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.84)',
    spark: '#fef3c7',
    era: '1950s · Mid-Century Hollywood',
    designers: 'Trifari · V&A Museum',
    provenance: 'Sweeping sculpted gold-tone and pavé rhinestone feather plume from Trifari’s golden mid-century atelier.'
  },
  {
    id: 'cartier-guard',
    name: 'Enameled Royal Guard Brooch',
    shortName: 'Cartier Guard',
    img: 'assets/museum_jewels/cartier-guard.png',
    color: '#dc2626',
    glow: 'rgba(248, 113, 113, 0.84)',
    spark: '#fecaca',
    era: '1953 · Coronation Figural',
    designers: 'Cartier · V&A Museum',
    provenance: 'Quirky, ultra-collectible enameled Yeoman Warder figural brooch in glossy scarlet, black onyx, and gold.'
  },
  {
    id: 'dior-snowflake',
    name: 'Powder-Blue & Pearl Snowflake',
    shortName: 'Dior Snowflake',
    img: 'assets/museum_jewels/dior-snowflake.png',
    color: '#7dd3fc',
    glow: 'rgba(125, 211, 252, 0.86)',
    spark: '#e0f2fe',
    era: 'c. 1952 · Christian Dior Couture',
    designers: 'Christian Dior by Mitchel Maer · V&A Museum',
    provenance: 'Luminous ice-blue crystal star-burst accented with creamy faux pearls in warm gilt prongs.'
  },

  // Stage 6: 1950s–60s Mid-Century Cocktail & Modernist Gold
  {
    id: 'grima-turquoise',
    name: 'Turquoise, Lapis & Gold Starburst',
    shortName: 'Grima Starburst',
    img: 'assets/museum_jewels/grima-turquoise.png',
    color: '#06b6d4',
    glow: 'rgba(34, 211, 238, 0.88)',
    spark: '#a5f3fc',
    era: '1967–1968 · Swinging 60s Modernist',
    designers: 'Andrew Grima · V&A Museum',
    provenance: 'Explosive spiky 18k gold rays bursting around a deep cobalt lapis dome and vivid Persian turquoise beads.'
  },
  {
    id: 'schlumberger-sapphire',
    name: 'Sapphire & Diamond Bouquet Brooch',
    shortName: 'Sapphire Bouquet',
    img: 'assets/museum_jewels/schlumberger-sapphire.png',
    color: '#2563eb',
    glow: 'rgba(59, 130, 246, 0.86)',
    spark: '#93c5fd',
    era: 'ca. 1960 · Tiffany Haute Couture',
    designers: 'Jean Schlumberger · V&A Museum',
    provenance: 'Tied diamond ribbon bouquet bursting with royal sapphires and sculpted gold fronds by Jean Schlumberger.'
  },
  {
    id: 'schlumberger-fruit',
    name: 'Emerald & Sapphire Twin Fruit',
    shortName: 'Emerald Fruit',
    img: 'assets/museum_jewels/schlumberger-fruit.png',
    color: '#10b981',
    glow: 'rgba(52, 211, 153, 0.86)',
    spark: '#a7f3d0',
    era: 'ca. 1960 · Mid-Century Couture',
    designers: 'Jean Schlumberger · V&A Museum',
    provenance: 'Whimsical lush emerald-and-sapphire pavé twin pinecones crowned with sparkling diamond leaves.'
  },
  {
    id: 'donald-amethyst',
    name: 'Brutalist Gold & Amethyst Sunburst',
    shortName: 'Donald Sun',
    img: 'assets/museum_jewels/donald-amethyst.png',
    color: '#f59e0b',
    glow: 'rgba(251, 191, 36, 0.84)',
    spark: '#fde68a',
    era: '1963 · British Modernist',
    designers: 'John Donald · V&A Museum',
    provenance: 'Edgy sculpted brutalist gold petals radiating around a raw-cut imperial purple amethyst crystal.'
  },
  {
    id: 'kjl-coral',
    name: 'Coral & Turquoise Nautilus Earrings',
    shortName: 'KJL Coral',
    img: 'assets/museum_jewels/kjl-coral.png',
    color: '#fb7185',
    glow: 'rgba(253, 164, 175, 0.84)',
    spark: '#ffe4e6',
    era: '1960s · Palm Springs Jet-Set',
    designers: 'Kenneth Jay Lane · V&A Museum',
    provenance: 'Playful peach-coral enamel shells swirled with rhinestones and bright turquoise cabochons by KJL.'
  },

  // Stage 7: Renaissance & Victorian Baroque Revival
  {
    id: 'canning-merman',
    name: 'The Canning Jewel Pearl Merman',
    shortName: 'Pearl Merman',
    img: 'assets/museum_jewels/canning-merman.png',
    color: '#ec4899',
    glow: 'rgba(244, 114, 182, 0.86)',
    spark: '#fbcfe8',
    era: '1850–1860 · Renaissance Revival',
    designers: 'The Canning Jewel · V&A Museum',
    provenance: 'Legendary baroque-pearl merman wielding a jawbone sword, encrusted in rubies, emeralds, and dangling pearls.'
  },
  {
    id: 'giuliano-caduceus',
    name: 'Pearl & Enamel Caduceus Brooch',
    shortName: 'Caduceus Pin',
    img: 'assets/museum_jewels/giuliano-caduceus.png',
    color: '#22c55e',
    glow: 'rgba(74, 222, 128, 0.82)',
    spark: '#bbf7d0',
    era: 'ca. 1900 · Renaissance Revival',
    designers: 'Arthur Giuliano · V&A Museum',
    provenance: 'Intricate winged-serpent caduceus crafted in luminous enamel, antique gold, and a glowing baroque pearl finial.'
  },
  {
    id: 'castellani-gold',
    name: 'Etruscan Gold & Carnelian Scarabs',
    shortName: 'Gold Scarabs',
    img: 'assets/museum_jewels/castellani-gold.png',
    color: '#f59e0b',
    glow: 'rgba(251, 191, 36, 0.86)',
    spark: '#fef08a',
    era: '19th Century · Etruscan Revival',
    designers: 'Castellani · V&A Museum',
    provenance: 'Triple-row 24k granulated gold cuff set with glowing carved carnelian scarab intaglios.'
  },
  {
    id: 'victorian-turquoise',
    name: 'Turquoise & Pearl Crescent Brooch',
    shortName: 'Crescent Pin',
    img: 'assets/museum_jewels/victorian-turquoise.png',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.84)',
    spark: '#bae6fd',
    era: '1860–1867 · Victorian Revival',
    designers: 'Victorian Goldsmith · V&A Museum',
    provenance: 'Ornate antique gold crescent inlaid with sky-blue Persian turquoise and swaying seed-pearl fringe.'
  },
  {
    id: 'amethyst-pearl',
    name: 'Amethyst & Seed-Pearl Scallop',
    shortName: 'Pearl Scallop',
    img: 'assets/museum_jewels/amethyst-pearl.png',
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.84)',
    spark: '#f3e8ff',
    era: '1800–1850 · Georgian / Victorian',
    designers: 'Antique Vault · V&A Museum',
    provenance: 'Luminous lace-like scalloped cloud of hand-strung seed pearls framing a vivid faceted amethyst.'
  },

  // Stage 8: Maximalist Modern & Haute Joaillerie Finale
  {
    id: 'wallace-butterfly',
    name: 'Iridescent Titanium Butterfly',
    shortName: 'Chan Butterfly',
    img: 'assets/museum_jewels/wallace-butterfly.png',
    color: '#e879f9',
    glow: 'rgba(232, 121, 249, 0.88)',
    spark: '#f5d0fe',
    era: '2022 · Contemporary Haute Joaillerie',
    designers: 'Wallace Chan · V&A Museum',
    provenance: 'Electric iridescent magenta, violet, and peacock-teal sculpted titanium butterfly encrusted in rubies and sapphires.'
  },
  {
    id: 'cindy-ruby',
    name: 'Sculptural Ruby Pavé Blossom',
    shortName: 'Ruby Blossom',
    img: 'assets/museum_jewels/cindy-ruby.png',
    color: '#e11d48',
    glow: 'rgba(244, 63, 94, 0.88)',
    spark: '#fda4af',
    era: '2018 · Contemporary Haute Joaillerie',
    designers: 'Cindy Chao · V&A Museum',
    provenance: 'Lush, undulating sculptural petals completely blanketed in pigeon-blood rubies with golden stamen sparks.'
  }
];

export const TIARA_PIECE = {
  id: 'tiara',
  name: 'Ruby & Diamond Royal Tiara',
  shortName: 'Royal Tiara',
  img: 'assets/museum_jewels/lavabre-tiara.png',
  color: '#ffd966',
  glow: 'rgba(255, 224, 102, 0.94)',
  spark: '#fff5b8',
  era: '1913 · Crown Jewel Masterpiece',
  designers: 'Henri Lavabre · V&A Museum',
  provenance: 'Match 5 in a line or win the Grand Jackpot to summon this 1913 diamond & ruby tiara. Swap with any jewel to clear every matching piece!'
};

export const JEWEL_MAP = Object.fromEntries(JEWELS.map((j) => [j.id, j]));

export const STAGES = [
  {
    stage: 1,
    eraId: 'art-nouveau',
    decade: '1895–1910',
    style: 'Art Nouveau & Enamel',
    title: 'Art Nouveau & Belle Époque',
    designers: ['René Lalique', 'Marcus & Co.', 'Child & Child'],
    curatorNote: 'Real V&A museum masterpieces: René Lalique’s blue enamel Medusa, Marcus & Co.’s fiery opal, and fluid gold-and-pearl filigree.',
    signatureJewel: 'marcus-opal',
    jewels: ['lalique-medusa', 'marcus-opal', 'lalique-gold', 'nouveau-pearl', 'child-amethyst'],
    swatch: 'linear-gradient(135deg, #eee5ff, #bfa2ee)',
    moves: 18,
    targetScore: 2200,
    goal: { type: 'score', label: 'Score 2,200' },
    gildedTiles: []
  },
  {
    stage: 2,
    eraId: 'chinoiserie',
    decade: '1920s–30s',
    style: 'Art Deco · Chinoiserie',
    title: 'Deco Chinoiserie & Jade',
    designers: ['Cartier', 'Paris Deco', 'Chinese Jade Archive'],
    curatorNote: 'Carved antique Chinese jade dragons, Cartier’s fluted lapis fan & onyx lozenge, and a 1925 carved coral flower basket.',
    signatureJewel: 'deco-coral-basket',
    jewels: ['chinese-jade', 'cartier-lapis', 'deco-coral-basket', 'cartier-lozenge', 'deco-tutti-frutti'],
    swatch: 'linear-gradient(135deg, #d7f2e3, #8ccfb1)',
    moves: 20,
    targetScore: 3600,
    goal: { type: 'collect', jewelId: 'deco-coral-basket', count: 14, label: '14 Coral Baskets' },
    gildedTiles: []
  },
  {
    stage: 3,
    eraId: 'mayan-egyptian',
    decade: '1858–1930',
    style: 'Mayan, Egyptian & Berber',
    title: 'Global Revival Treasures',
    designers: ['Pre-Columbian Gold', 'Castellani', 'Art Deco Revival'],
    curatorNote: 'Pre-Columbian Veraguas gold, stepped Mayan-Deco coral plaques, Castellani teal scarabs, giant obsidian beetles & Berber coral silver.',
    signatureJewel: 'precolumbian-gold',
    jewels: ['precolumbian-gold', 'deco-stepped', 'castellani-scarab', 'berber-coral', 'beetle-scarab'],
    swatch: 'linear-gradient(135deg, #f8d8be, #d98c64)',
    moves: 20,
    targetScore: 4800,
    goal: { type: 'gilded', count: 4, label: 'Polish 4 Gold Tiles' },
    gildedTiles: [
      [2, 2], [2, 4], [4, 2], [4, 4]
    ]
  },
  {
    stage: 4,
    eraId: 'bakelite',
    decade: '1930s–50s',
    style: 'Surrealist, Bakelite & Whimsy',
    title: 'Weird, Adorable & Chic',
    designers: ['Cartier', 'Paul Flato', 'Christian Dior', '1930s Bakelite'],
    curatorNote: 'Connie’s playful spirit: Paul Flato’s gold feet with ruby toenails, Cartier’s coral hand & moonstone owl, 1930s Bakelite, and Dior’s diamond unicorn!',
    signatureJewel: 'cartier-hand',
    jewels: ['cartier-hand', 'flato-feet', 'bakelite-oval', 'cartier-owl', 'dior-unicorn'],
    swatch: 'linear-gradient(135deg, #fff1c9, #f9b27a)',
    moves: 21,
    targetScore: 6000,
    goal: { type: 'collect', jewelId: 'flato-feet', count: 14, label: '14 Flato Feet' },
    gildedTiles: []
  },
  {
    stage: 5,
    eraId: 'golden-age',
    decade: '1940s–50s',
    style: 'Hollywood & Dior Couture',
    title: 'Golden Age & Christian Dior',
    designers: ['Christian Dior', 'Trifari', 'Cartier', 'Mitchel Maer'],
    curatorNote: '1952 Christian Dior rhinestone unicorns, snowflakes & cherub amethysts paired with Trifari gold plumes and jeweled Hollywood peacocks.',
    signatureJewel: 'dior-unicorn',
    jewels: ['dior-unicorn', 'dior-amethyst', 'peacock-1940s', 'trifari-plume', 'cartier-guard', 'dior-snowflake'],
    swatch: 'linear-gradient(135deg, #fde2ec, #eca2c0)',
    moves: 22,
    targetScore: 7600,
    goal: { type: 'collect', jewelId: 'dior-unicorn', count: 15, label: '15 Dior Unicorns' },
    gildedTiles: []
  },
  {
    stage: 6,
    eraId: 'mid-century',
    decade: '1960s',
    style: 'Cocktail & Modernist Gold',
    title: 'Swinging 60s Cocktail Glam',
    designers: ['Andrew Grima', 'Jean Schlumberger', 'Kenneth Jay Lane', 'John Donald'],
    curatorNote: 'Andrew Grima’s explosive turquoise-gold starburst, Schlumberger sapphire bouquets & emerald fruit, KJL peach coral, and brutalist gold.',
    signatureJewel: 'grima-turquoise',
    jewels: ['grima-turquoise', 'schlumberger-sapphire', 'schlumberger-fruit', 'donald-amethyst', 'kjl-coral', 'dior-unicorn'],
    swatch: 'linear-gradient(135deg, #daf7f2, #86d8cc)',
    moves: 22,
    targetScore: 9400,
    goal: { type: 'collect', jewelId: 'grima-turquoise', count: 15, label: '15 Grima Starbursts' },
    gildedTiles: []
  },
  {
    stage: 7,
    eraId: 'paris-runway',
    decade: 'Renaissance–1900',
    style: 'Baroque & Archaeological',
    title: 'Baroque & Merman Revival',
    designers: ['The Canning Jewel', 'Castellani', 'Arthur Giuliano', 'Christian Dior'],
    curatorNote: 'Maximalist museum treasures: the iconic baroque-pearl Canning Merman, Castellani granulated gold scarabs, and seed-pearl amethysts.',
    signatureJewel: 'canning-merman',
    jewels: ['canning-merman', 'giuliano-caduceus', 'castellani-gold', 'dior-amethyst', 'victorian-turquoise', 'amethyst-pearl'],
    swatch: 'linear-gradient(135deg, #faf0dc, #e5b78b)',
    moves: 23,
    targetScore: 11800,
    goal: { type: 'gilded', count: 6, label: 'Polish 6 Gold Tiles' },
    gildedTiles: [
      [1, 3], [2, 3], [3, 1], [3, 3], [3, 5], [5, 3]
    ]
  },
  {
    stage: 8,
    eraId: 'power-80s',
    decade: 'Modern Couture',
    style: 'Maximalist Haute Joaillerie',
    title: 'Maximalist Grand Finale',
    designers: ['Wallace Chan', 'Cindy Chao', 'Andrew Grima', 'Paul Flato'],
    curatorNote: 'Pure dopamine opulence: Wallace Chan’s electric titanium butterfly, Cindy Chao’s ruby blossom, Andrew Grima’s starburst & Cartier’s moonstone owl.',
    signatureJewel: 'wallace-butterfly',
    jewels: ['wallace-butterfly', 'cindy-ruby', 'grima-turquoise', 'schlumberger-fruit', 'cartier-owl', 'flato-feet'],
    swatch: 'linear-gradient(135deg, #ff79b8, #9f1b74)',
    moves: 25,
    targetScore: 15000,
    goal: { type: 'gilded', count: 8, label: 'Polish 8 Gold Tiles' },
    gildedTiles: [
      [1, 2], [1, 4], [2, 1], [2, 5],
      [4, 1], [4, 5], [5, 2], [5, 4]
    ]
  }
];

export function getStageConfig(stageNum) {
  if (stageNum <= STAGES.length) {
    return STAGES[stageNum - 1];
  }
  const base = STAGES[(stageNum - 1) % STAGES.length];
  const extra = stageNum - STAGES.length;
  const targetScore = 15000 + extra * 4000;
  const collectJewel = JEWEL_MAP[base.signatureJewel] || JEWELS[0];
  return {
    ...base,
    stage: stageNum,
    title: `${base.title} Encore`,
    moves: 25,
    targetScore,
    goal: {
      type: 'collect',
      jewelId: collectJewel.id,
      count: 16 + extra * 2,
      label: `${16 + extra * 2} ${collectJewel.shortName}s`
    },
    gildedTiles: []
  };
}

export const GLAMOUR_CALLOUTS = [
  'Luminous',
  'Radiant',
  'Exquisite',
  'Sublime',
  'Rare Find',
  'Museum Grade',
  'Sovereign',
  'Transcendent'
];
