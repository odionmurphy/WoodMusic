import "dotenv/config";
import { nanoid } from "nanoid";
import { db, ensureSchema } from "./client";
import { categories, products } from "./schema";
import { eq } from "drizzle-orm";

const categoryData = [
  { slug: "turntables", name: "Turntables", blurb: "Direct-drive decks built for scratching, mixing, and touring." },
  { slug: "mixers", name: "Mixers", blurb: "Rotary and club-standard mixers for clean, warm blends." },
  { slug: "controllers", name: "Controllers", blurb: "All-in-one setups for digital sets and hybrid rigs." },
  { slug: "headphones", name: "Headphones", blurb: "Cue up the next track without missing a beat in the room." },
  { slug: "vinyl", name: "Vinyl", blurb: "Fresh pressings and reissues for crate-diggers." },
  { slug: "cartridges", name: "Cartridges & Needles", blurb: "The last half-inch between the groove and the amp." },
];

const productData = [
  {
    slug: "sl-1210-mk7-pair",
    name: "SL-1210 Direct-Drive Turntable (Pair)",
    brand: "Technics",
    unitNumber: "UNIT NO. 001",
    description:
      "The industry-standard direct-drive deck, reborn. Rock-solid torque, near-instant start-up, and a pitch fader that still feels like nothing else on the market. This is the pair every booth is built around.",
    specSheet: { "Drive type": "Direct-drive", "Wow & flutter": "0.025% WRMS", "Starting torque": "1.8 kg·cm", "Pitch range": "±8 / ±16 / ±50%", "Weight (each)": "9.8 kg" },
    priceCents: 219900, stock: 6, imageHue: 32, featured: true, category: "turntables",
  },
  {
    slug: "sp-7-rotary",
    name: "SP-7 Rotary Mixer",
    brand: "Isonoe",
    unitNumber: "UNIT NO. 002",
    description:
      "A four-channel rotary mixer built the old way: discrete analog path, stepped gain knobs instead of faders, and a low end that stays musical at full send. Designed for DJs who mix with their ears, not a screen.",
    specSheet: { "Channels": "4 (rotary gain)", "Signal path": "Fully analog", "Phono preamps": "Built-in, switchable", "Outputs": "XLR master + RCA booth", "Headroom": "+22 dBu" },
    priceCents: 189000, stock: 4, imageHue: 12, featured: true, category: "mixers",
  },
  {
    slug: "club-nexus-two",
    name: "Club Nexus Two-Channel Mixer",
    brand: "Sequence",
    unitNumber: "UNIT NO. 003",
    description:
      "The club-standard two-channel format, tightened up. Isolator EQ, a filter that doesn't fizz out at the extremes, and a build quality rated for a decade of Saturday nights.",
    specSheet: { "Channels": "2 + mic", "EQ": "3-band isolator", "Filter": "Resonant HP/LP", "Crossfader": "Contactless, curve adjustable", "Inputs": "Phono/Line switchable" },
    priceCents: 84900, stock: 11, imageHue: 205, featured: false, category: "mixers",
  },
  {
    slug: "deckstream-4",
    name: "DeckStream 4-Channel Controller",
    brand: "Waveform",
    unitNumber: "UNIT NO. 004",
    description:
      "A full four-deck controller with motorized jog wheels and a screen on every channel, so you can keep your head up and your eyes on the room instead of a laptop.",
    specSheet: { "Decks": "4, motorized jogs", "Displays": "Per-channel color screens", "Pads": "16 RGB performance pads", "Audio interface": "24-bit / 48kHz, 4 outs", "Software": "Works with major DJ software" },
    priceCents: 129900, stock: 8, imageHue: 265, featured: true, category: "controllers",
  },
  {
    slug: "loopdeck-2",
    name: "LoopDeck 2 Compact Controller",
    brand: "Waveform",
    unitNumber: "UNIT NO. 005",
    description:
      "Two decks, a mixer section, and a set of performance pads in a footprint that fits in a backpack. Built for the DJ whose gig bag also has to fit a laptop and a change of shirt.",
    specSheet: { "Decks": "2", "Jog wheels": "Touch-capacitive", "Weight": "1.6 kg", "Pads": "8 RGB performance pads", "Power": "USB bus-powered" },
    priceCents: 39900, stock: 14, imageHue: 265, featured: false, category: "controllers",
  },
  {
    slug: "cue-one-dj",
    name: "Cue One DJ Headphones",
    brand: "Isonoe",
    unitNumber: "UNIT NO. 006",
    description:
      "Sealed-back cans built for the booth: enough isolation to cue a track over a full-volume room, a coiled cable that survives getting stepped on, and a swivel cup for one-ear monitoring.",
    specSheet: { "Driver": "50mm neodymium", "Isolation": "Passive, sealed-back", "Cable": "Coiled, 3m extended", "Ear cup": "180° swivel", "Impedance": "32 Ω" },
    priceCents: 16900, stock: 22, imageHue: 12, featured: true, category: "headphones",
  },
  {
    slug: "monitor-fold-x",
    name: "Monitor Fold X Headphones",
    brand: "Sequence",
    unitNumber: "UNIT NO. 007",
    description:
      "A flatter, more neutral tuning for DJs who also produce — trustworthy low end for translating mixes, with the same booth-ready durability as the rest of the range.",
    specSheet: { "Driver": "45mm neodymium", "Frequency response": "10 Hz – 25 kHz", "Fold design": "Flat-folding, travel case included", "Cable": "Detachable, 1.2m + 3m", "Impedance": "38 Ω" },
    priceCents: 14900, stock: 17, imageHue: 205, featured: false, category: "headphones",
  },
  {
    slug: "concrete-groove-lp",
    name: "Concrete Groove — 12\" LP",
    brand: "Subfloor Records",
    unitNumber: "UNIT NO. 008",
    description:
      "A raw, warehouse-built house record pressed on heavyweight 180g vinyl. Four cuts, all mixable in key, mastered loud enough to hold up next to anything else in the box.",
    specSheet: { "Format": "12\" LP, 180g", "Tracks": "4", "Speed": "33⅓ RPM", "Pressing": "Limited run", "Genre": "House" },
    priceCents: 2600, stock: 40, imageHue: 45, featured: false, category: "vinyl",
  },
  {
    slug: "night-bus-ep",
    name: "Night Bus EP — 12\" Vinyl",
    brand: "Subfloor Records",
    unitNumber: "UNIT NO. 009",
    description:
      "Three tracks of late-night, low-BPM electro built for the last hour of a set. B-side includes an instrumental and an a cappella for edits.",
    specSheet: { "Format": "12\" EP, 140g", "Tracks": "3 + instrumental", "Speed": "33⅓ RPM", "Pressing": "First edition", "Genre": "Electro" },
    priceCents: 2200, stock: 33, imageHue: 265, featured: true, category: "vinyl",
  },
  {
    slug: "root-selector-lp",
    name: "Root Selector — 12\" LP",
    brand: "Highwater Sound",
    unitNumber: "UNIT NO. 010",
    description:
      "A dub-influenced selector's record with deep low end designed for a proper sound system. Cut loud, pressed heavy, and built to survive years in a working crate.",
    specSheet: { "Format": "12\" LP, 180g", "Tracks": "5", "Speed": "33⅓ RPM", "Pressing": "Repress", "Genre": "Dub / Bass" },
    priceCents: 2400, stock: 28, imageHue: 145, featured: false, category: "vinyl",
  },
  {
    slug: "mm-scratch-elliptical",
    name: "MM Scratch Cartridge — Elliptical",
    brand: "Groovetrace",
    unitNumber: "UNIT NO. 011",
    description:
      "A moving-magnet cartridge tuned for scratch DJs: high tracking force tolerance so the needle stays in the groove through backspins and transforms, without chewing up your records.",
    specSheet: { "Type": "Moving magnet", "Stylus": "Elliptical", "Tracking force": "3–5 g", "Output": "6.5 mV", "Recommended for": "Scratch / battle" },
    priceCents: 8900, stock: 19, imageHue: 32, featured: false, category: "cartridges",
  },
  {
    slug: "mm-listening-spherical",
    name: "MM Listening Cartridge — Spherical",
    brand: "Groovetrace",
    unitNumber: "UNIT NO. 012",
    description:
      "A gentler tracking cartridge for long mixing sessions and record shopping — smoother top end, lower tracking force, and better record longevity for a deck that isn't taking a beating.",
    specSheet: { "Type": "Moving magnet", "Stylus": "Spherical", "Tracking force": "1.5–3 g", "Output": "5 mV", "Recommended for": "Mixing / digging" },
    priceCents: 5900, stock: 25, imageHue: 145, featured: false, category: "cartridges",
  },
];

async function main() {
  ensureSchema();

  console.log("Seeding categories…");
  const categoryIdBySlug = new Map<string, string>();
  for (const c of categoryData) {
    const existing = await db.select().from(categories).where(eq(categories.slug, c.slug)).get();
    if (existing) {
      categoryIdBySlug.set(c.slug, existing.id);
    } else {
      const id = nanoid();
      await db.insert(categories).values({ id, ...c });
      categoryIdBySlug.set(c.slug, id);
    }
  }

  console.log("Seeding products…");
  for (const p of productData) {
    const { category, specSheet, ...rest } = p;
    const existing = await db.select().from(products).where(eq(products.slug, p.slug)).get();
    const row = {
      ...rest,
      specSheet: JSON.stringify(specSheet),
      categoryId: categoryIdBySlug.get(category)!,
      createdAt: new Date(),
    };
    if (existing) {
      await db.update(products).set(row).where(eq(products.id, existing.id));
    } else {
      await db.insert(products).values({ id: nanoid(), ...row });
    }
  }

  console.log(`Done: ${categoryData.length} categories, ${productData.length} products.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
