/**
 * Jewel Queen — 100% Real Museum-Photographed Antique, Vintage & Contemporary Jewelry
 * Curated exclusively from the Victoria & Albert Museum (V&A) across 8 historically &
 * stylistically cohesive gallery rooms (45 unique museum masterpieces, zero cross-era filler).
 */

export const BOARD_SIZE = 7;

export const JEWELS = [
  // =========================================================================
  // Room 1: 1895–1910 · Art Nouveau — Enamel & Opal
  // =========================================================================
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

  // =========================================================================
  // Room 2: 1920s–30s · Art Deco — Geometric Modernism
  // =========================================================================
  {
    id: 'cartier-lapis',
    name: 'Carved Lapis & Diamond Fan Brooch',
    shortName: 'Cartier Lapis',
    img: 'assets/museum_jewels/cartier-lapis.png',
    color: '#2563eb',
    glow: 'rgba(59, 130, 246, 0.86)',
    spark: '#93c5fd',
    era: '1920–1930 · Art Deco Geometric',
    designers: 'Cartier · V&A Museum',
    provenance: 'Fluted royal-cobalt carved lapis lazuli fan accented with crisp black onyx and sparkling platinum diamonds.'
  },
  {
    id: 'deco-stepped',
    name: 'Stepped Coral & Moonstone Plaque',
    shortName: 'Stepped Plaque',
    img: 'assets/museum_jewels/deco-stepped.png',
    color: '#fb923c',
    glow: 'rgba(251, 146, 60, 0.84)',
    spark: '#ffedd5',
    era: '1920–1930 · Art Deco Geometric',
    designers: 'Parisian Deco Atelier · V&A Museum',
    provenance: 'Architectural stepped coral-orange and onyx fretwork framed in diamonds and frosted moonstone cylinders.'
  },
  {
    id: 'templier-coral',
    name: 'Black Enamel & Coral Bar Brooch',
    shortName: 'Templier Coral',
    img: 'assets/museum_jewels/templier-coral.png',
    color: '#f97316',
    glow: 'rgba(251, 146, 60, 0.86)',
    spark: '#fed7aa',
    era: 'ca. 1930 · Machine-Age Art Deco',
    designers: 'Raymond Templier · V&A Museum',
    provenance: 'Streamlined Parisian modernist bar brooch by Raymond Templier pairing glossy black enamel, diamonds, and glowing coral cabochons.'
  },
  {
    id: 'fouquet-turquoise',
    name: 'Turquoise & Black Onyx Drop Pendant',
    shortName: 'Fouquet Turquoise',
    img: 'assets/museum_jewels/fouquet-turquoise.png',
    color: '#06b6d4',
    glow: 'rgba(34, 211, 238, 0.86)',
    spark: '#a5f3fc',
    era: 'ca. 1920 · Parisian Art Deco',
    designers: 'Georges Fouquet · V&A Museum',
    provenance: 'Graphic sky-blue matrix turquoise framed in white gold, diamonds, and a sleek black chalcedony drop by Georges Fouquet.'
  },
  {
    id: 'deco-bow',
    name: 'Baguette Diamond & Onyx Bow Brooch',
    shortName: 'Deco Bow',
    img: 'assets/museum_jewels/deco-bow.png',
    color: '#e2e8f0',
    glow: 'rgba(226, 232, 240, 0.86)',
    spark: '#ffffff',
    era: '1930–1940 · High Art Deco',
    designers: 'Art Deco Haute Joaillerie · V&A Museum',
    provenance: 'Architectural platinum bow-tie brooch paved with crisp brilliant- and baguette-cut diamonds and hairline black onyx.'
  },

  // =========================================================================
  // Room 3: 1920s–30s · Art Deco — Tutti Frutti & Flower Baskets
  // =========================================================================
  {
    id: 'deco-coral-basket',
    name: 'Carved Coral Flower Basket Brooch',
    shortName: 'Coral Basket',
    img: 'assets/museum_jewels/deco-coral-basket.png',
    color: '#ef4444',
    glow: 'rgba(248, 113, 113, 0.86)',
    spark: '#fecaca',
    era: 'ca. 1925 · Art Deco Floral',
    designers: 'Parisian Deco Atelier · V&A Museum',
    provenance: 'Carved crimson-coral poppies and nephrite jade leaves blooming from a sparkling platinum-and-diamond basket.'
  },
  {
    id: 'deco-fruit-basket',
    name: 'Jade & Chalcedony Fruit Basket',
    shortName: 'Fruit Basket',
    img: 'assets/museum_jewels/deco-fruit-basket.png',
    color: '#22c55e',
    glow: 'rgba(74, 222, 128, 0.84)',
    spark: '#bbf7d0',
    era: '1928 · Art Deco Floral',
    designers: 'Art Deco Atelier · V&A Museum',
    provenance: 'Lively 1928 diamond basket overflowing with carved nephrite jade foliage, citrus-gold fruit, and white & terracotta blossoms.'
  },
  {
    id: 'ostertag-tutti-frutti',
    name: 'Tutti Frutti Gem-Tree Urn Brooch',
    shortName: 'Ostertag Urn',
    img: 'assets/museum_jewels/ostertag-tutti-frutti.png',
    color: '#3b82f6',
    glow: 'rgba(96, 165, 250, 0.86)',
    spark: '#bfdbfe',
    era: '1927–1940 · Art Deco Tutti Frutti',
    designers: 'Ostertag Paris · V&A Museum',
    provenance: 'Parisian Tutti Frutti tree of carved sapphires, rubies, and a glowing central emerald rising from a platinum-diamond urn.'
  },
  {
    id: 'deco-tutti-arch',
    name: 'Emerald, Ruby & Sapphire Arch Brooch',
    shortName: 'Tutti Arch',
    img: 'assets/museum_jewels/deco-tutti-arch.png',
    color: '#10b981',
    glow: 'rgba(52, 211, 153, 0.86)',
    spark: '#a7f3d0',
    era: 'ca. 1930 · Art Deco Tutti Frutti',
    designers: 'French Deco Joaillier · V&A Museum',
    provenance: 'Sculpted platinum horseshoe arch crowned and tipped with vibrant clusters of carved emeralds, rubies, and blue sapphires.'
  },
  {
    id: 'deco-tutti-frutti',
    name: 'Baroque Pearl & Gem Botanical Brooch',
    shortName: 'Deco Botanical',
    img: 'assets/museum_jewels/deco-tutti-frutti.png',
    color: '#f43f5e',
    glow: 'rgba(251, 113, 133, 0.82)',
    spark: '#fecdd3',
    era: '1920–1930 · Art Deco Botanical',
    designers: 'Art Deco Joaillier · V&A Museum',
    provenance: 'Lustrous baroque pearl drop poised above stepped diamond geometry, carved flowers, and baguette emerald, ruby, and sapphire accents.'
  },

  // =========================================================================
  // Room 4: 1930s–50s · Surrealist & Figural Couture
  // =========================================================================
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
    provenance: 'Iconic surrealist brooch: a carved pink coral hand with jeweled cuffs clutching a glossy black onyx & diamond rose.'
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
    provenance: 'Playful pair of gleaming yellow-gold bare-feet dress clips manicured with ten pigeon-blood ruby toenails.'
  },
  {
    id: 'cartier-owl',
    name: 'Carved Moonstone & Turquoise Owl',
    shortName: 'Cartier Owl',
    img: 'assets/museum_jewels/cartier-owl.png',
    color: '#f8fafc',
    glow: 'rgba(248, 250, 252, 0.86)',
    spark: '#ffffff',
    era: 'ca. 1950 · Figural Couture',
    designers: 'Cartier · V&A Museum',
    provenance: 'Endearing carved translucent quartz & moonstone owl perched on a gold branch with glowing cabochon turquoise eyes.'
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
    provenance: 'Witty miniature Yeoman Warder figural brooch in glossy scarlet champlevé enamel, black onyx, and gold.'
  },
  {
    id: 'treskow-fish',
    name: 'Granulated Gold & Sapphire Fish',
    shortName: 'Treskow Fish',
    img: 'assets/museum_jewels/treskow-fish.png',
    color: '#eab308',
    glow: 'rgba(250, 204, 21, 0.84)',
    spark: '#fef08a',
    era: '1953 · Mid-Century Figural',
    designers: 'Elisabeth Treskow · V&A Museum',
    provenance: 'Charming granulated 18k gold fish brooch winking with a deep cabochon sapphire eye, twinkling diamonds, and a luminous baroque pearl tail.'
  },

  // =========================================================================
  // Room 5: 1940s–50s · Golden Age Hollywood & Dior Couture
  // =========================================================================
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
    provenance: 'Sculptural white-rhinestone pavé unicorn head with antique gold mane — peak fairytale runway glamour.'
  },
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
  {
    id: 'tiffany-shells',
    name: 'Fluted Gold & Sapphire Shell Clips',
    shortName: 'Tiffany Shells',
    img: 'assets/museum_jewels/tiffany-shells.png',
    color: '#f59e0b',
    glow: 'rgba(251, 191, 36, 0.86)',
    spark: '#fef3c7',
    era: '1940–1950 · Retro Hollywood Gold',
    designers: 'Tiffany & Co. · V&A Museum',
    provenance: 'Gleaming sculpted 18k yellow-gold seashell clips centered with clusters of deep blue sapphires and bright diamonds.'
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

  // =========================================================================
  // Room 6: 1960s · Swinging 60s Sculptural Gold
  // =========================================================================
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
    provenance: 'Lush emerald-and-sapphire pavé twin pinecones crowned with sparkling diamond leaves.'
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
    provenance: 'Sculpted brutalist gold petals radiating around a raw-cut imperial purple amethyst crystal.'
  },
  {
    id: 'king-tourmaline',
    name: 'Molten Gold & Watermelon Tourmaline',
    shortName: 'King Tourmaline',
    img: 'assets/museum_jewels/king-tourmaline.png',
    color: '#ec4899',
    glow: 'rgba(244, 114, 182, 0.86)',
    spark: '#fbcfe8',
    era: 'ca. 1970 · Sculptural Modernist',
    designers: 'Arthur King · V&A Museum',
    provenance: 'Organic molten 18k gold sculpture cradling bold uncut slices of vivid pink-and-green watermelon tourmaline.'
  },
  {
    id: 'kjl-coral',
    name: 'Coral & Turquoise Nautilus Clips',
    shortName: 'KJL Coral',
    img: 'assets/museum_jewels/kjl-coral.png',
    color: '#fb7185',
    glow: 'rgba(253, 164, 175, 0.84)',
    spark: '#ffe4e6',
    era: '1960s · Palm Springs Jet-Set',
    designers: 'Kenneth Jay Lane · V&A Museum',
    provenance: 'Playful peach-coral enamel shells swirled with rhinestones and bright turquoise cabochons by KJL.'
  },

  // =========================================================================
  // Room 7: 1850–1900 · Victorian Archaeological & Baroque Revival
  // =========================================================================
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
    id: 'castellani-scarab',
    name: 'Teal Egyptian Scarab Gold Brooch',
    shortName: 'Teal Scarab',
    img: 'assets/museum_jewels/castellani-scarab.png',
    color: '#0d9488',
    glow: 'rgba(45, 212, 191, 0.82)',
    spark: '#99f6e4',
    era: 'ca. 1858 · Archaeological Revival',
    designers: 'Castellani · V&A Museum',
    provenance: 'Carved deep teal-jade scarab mounted in granulated antique Etruscan-revival gold by Castellani.'
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

  // =========================================================================
  // Room 8: 2000–2022 · Contemporary Haute Joaillerie
  // =========================================================================
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
  },
  {
    id: 'faisceaux-prism',
    name: 'Faisceaux Holographic Crystal Brooch',
    shortName: 'Boucheron Prism',
    img: 'assets/museum_jewels/faisceaux-prism.png',
    color: '#a5f3fc',
    glow: 'rgba(165, 243, 252, 0.88)',
    spark: '#ffffff',
    era: '2020 · Contemporary Haute Joaillerie',
    designers: 'Boucheron Paris · V&A Museum',
    provenance: 'Futuristic faceted rock-crystal prism treated with optical holographic iridescence and banded in gold and diamonds.'
  },
  {
    id: 'webster-fish',
    name: 'Jewels Verne Fighting Fish Cuff',
    shortName: 'Fighting Fish',
    img: 'assets/museum_jewels/webster-fish.png',
    color: '#3b82f6',
    glow: 'rgba(96, 165, 250, 0.86)',
    spark: '#bfdbfe',
    era: '2009 · Contemporary Haute Joaillerie',
    designers: 'Stephen Webster · V&A Museum',
    provenance: 'Sculptural midnight titanium fighting fish gleaming with 229 blue sapphires, 189 black spinels, and 24 white diamonds.'
  },
  {
    id: 'corvaja-gold',
    name: 'Hexagonal Gold & Platinum Stardust',
    shortName: 'Corvaja Hex',
    img: 'assets/museum_jewels/corvaja-gold.png',
    color: '#facc15',
    glow: 'rgba(250, 204, 21, 0.86)',
    spark: '#fef08a',
    era: '2000 · Contemporary Goldsmithing',
    designers: 'Giovanni Corvaja · V&A Museum',
    provenance: 'Architectural 18k gold polyhedron filled with a gossamer nebula of microscopic platinum filaments and golden stardust granules.'
  },
  {
    id: 'short-enamel',
    name: 'Crimson & Cobalt Enamel Ribbon',
    shortName: 'Enamel Ribbon',
    img: 'assets/museum_jewels/short-enamel.png',
    color: '#f43f5e',
    glow: 'rgba(251, 113, 133, 0.86)',
    spark: '#fecdd3',
    era: '2007 · Contemporary Enamel Art',
    designers: 'Jane Short MBE · V&A Museum',
    provenance: 'Sweeping contemporary sculpted silver ribbon glowing with molten ruby-crimson, gold, and midnight-blue champlevé enamel.'
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
    style: 'Art Nouveau · Enamel & Opal',
    title: 'Art Nouveau: Enamel & Opal',
    designers: ['René Lalique', 'Marcus & Co.', 'Child & Child'],
    curatorNote: 'Turn-of-the-century plique-à-jour enamels, fiery Australian black opal, and sinuous baroque pearls from the V&A’s Art Nouveau vitrine.',
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
    eraId: 'deco-geometric',
    decade: '1920s–30s',
    style: 'Art Deco · Geometric Modernism',
    title: 'Art Deco: Geometric Contrast',
    designers: ['Cartier', 'Raymond Templier', 'Georges Fouquet'],
    curatorNote: 'Pure Jazz Age architecture: Cartier’s fluted lapis fan, Raymond Templier’s black-enamel & coral bar, Georges Fouquet’s turquoise onyx drop, and crisp baguette diamonds.',
    signatureJewel: 'cartier-lapis',
    jewels: ['cartier-lapis', 'deco-stepped', 'templier-coral', 'fouquet-turquoise', 'deco-bow'],
    swatch: 'linear-gradient(135deg, #b8dcff, #5085e8)',
    moves: 20,
    targetScore: 3600,
    goal: { type: 'collect', jewelId: 'cartier-lapis', count: 14, label: '14 Cartier Lapis' },
    gildedTiles: []
  },
  {
    stage: 3,
    eraId: 'deco-tutti-frutti',
    decade: '1920s–30s',
    style: 'Art Deco · Tutti Frutti & Baskets',
    title: 'Art Deco: Tutti Frutti & Florals',
    designers: ['Ostertag Paris', 'Parisian Deco', 'French Joailliers'],
    curatorNote: 'The exuberant color side of 1920s–30s Parisian Art Deco: carved coral & jade flower baskets alongside Ostertag’s emerald, ruby, and sapphire Tutti Frutti creations.',
    signatureJewel: 'deco-coral-basket',
    jewels: ['deco-coral-basket', 'deco-fruit-basket', 'ostertag-tutti-frutti', 'deco-tutti-arch', 'deco-tutti-frutti'],
    swatch: 'linear-gradient(135deg, #ffd1c1, #e86b7a)',
    moves: 20,
    targetScore: 4800,
    goal: { type: 'gilded', count: 4, label: 'Polish 4 Showcase Tiles' },
    gildedTiles: [
      [2, 2], [2, 4], [4, 2], [4, 4]
    ]
  },
  {
    stage: 4,
    eraId: 'surrealist-figural',
    decade: '1930s–50s',
    style: 'Surrealist & Figural Couture',
    title: 'Surrealist & Figural Menagerie',
    designers: ['Cartier', 'Paul Flato', 'Elisabeth Treskow'],
    curatorNote: 'Witty mid-century sculptural couture: Cartier’s surreal coral hand, moonstone owl & Royal Guard, Paul Flato’s ruby-toenail gold feet, and Treskow’s sapphire gold fish.',
    signatureJewel: 'cartier-hand',
    jewels: ['cartier-hand', 'flato-feet', 'cartier-owl', 'cartier-guard', 'treskow-fish'],
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
    designers: ['Christian Dior', 'Tiffany & Co.', 'Trifari'],
    curatorNote: '1940s–50s evening radiance: Christian Dior by Mitchel Maer unicorns, snowflakes & cherubs paired with Tiffany’s fluted gold shells, Trifari plumes, and jeweled peacocks.',
    signatureJewel: 'dior-unicorn',
    jewels: ['dior-unicorn', 'dior-amethyst', 'dior-snowflake', 'tiffany-shells', 'trifari-plume', 'peacock-1940s'],
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
    style: 'Swinging 60s · Sculptural Gold',
    title: 'Swinging 60s Sculptural Gold',
    designers: ['Andrew Grima', 'Jean Schlumberger', 'John Donald', 'Arthur King'],
    curatorNote: 'Bold textured 18k gold & raw minerals: Andrew Grima’s turquoise starburst, Schlumberger’s gem bouquets, John Donald’s brutalist amethyst, Arthur King tourmalines & KJL coral.',
    signatureJewel: 'grima-turquoise',
    jewels: ['grima-turquoise', 'schlumberger-sapphire', 'schlumberger-fruit', 'donald-amethyst', 'king-tourmaline', 'kjl-coral'],
    swatch: 'linear-gradient(135deg, #daf7f2, #86d8cc)',
    moves: 22,
    targetScore: 9400,
    goal: { type: 'collect', jewelId: 'grima-turquoise', count: 15, label: '15 Grima Starbursts' },
    gildedTiles: []
  },
  {
    stage: 7,
    eraId: 'victorian-revival',
    decade: '1850–1900',
    style: 'Victorian Archaeological & Baroque',
    title: 'Victorian & Renaissance Revival',
    designers: ['The Canning Jewel', 'Castellani', 'Arthur Giuliano'],
    curatorNote: 'Opulent 19th-century historical revivals: the baroque-pearl Canning Merman, Castellani granulated gold scarabs, Giuliano’s polychrome enamel caduceus & seed-pearl classics.',
    signatureJewel: 'canning-merman',
    jewels: ['canning-merman', 'giuliano-caduceus', 'castellani-gold', 'castellani-scarab', 'victorian-turquoise', 'amethyst-pearl'],
    swatch: 'linear-gradient(135deg, #faf0dc, #e5b78b)',
    moves: 23,
    targetScore: 11800,
    goal: { type: 'gilded', count: 6, label: 'Polish 6 Showcase Tiles' },
    gildedTiles: [
      [1, 3], [2, 3], [3, 1], [3, 3], [3, 5], [5, 3]
    ]
  },
  {
    stage: 8,
    eraId: 'contemporary-haute',
    decade: '2000–2022',
    style: 'Contemporary Haute Joaillerie',
    title: '21st-Century Masterworks',
    designers: ['Wallace Chan', 'Cindy Chao', 'Boucheron', 'Stephen Webster'],
    curatorNote: 'Cutting-edge 21st-century alchemy: Wallace Chan’s titanium butterfly, Cindy Chao’s ruby blossom, Boucheron’s holographic crystal prism, Stephen Webster’s sapphire fish & Corvaja gold.',
    signatureJewel: 'wallace-butterfly',
    jewels: ['wallace-butterfly', 'cindy-ruby', 'faisceaux-prism', 'webster-fish', 'corvaja-gold', 'short-enamel'],
    swatch: 'linear-gradient(135deg, #ff79b8, #70d6ff)',
    moves: 25,
    targetScore: 15000,
    goal: { type: 'gilded', count: 8, label: 'Polish 8 Showcase Tiles' },
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
