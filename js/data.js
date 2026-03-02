// =====================================================
//  MW2 / IW4x — Complete Game Data Reference
//  All internal IDs verified from actual getPlayerData
// =====================================================

const WEAPONS = {
  assault: {
    label: "— Assault Rifles —",
    items: [
      { id: "m4", name: "M4A1", stats: { damage: 7, range: 7, fireRate: 8, accuracy: 7 } },
      { id: "m16", name: "M16A4", stats: { damage: 8, range: 8, fireRate: 5, accuracy: 9 } },
      { id: "scar", name: "SCAR-H", stats: { damage: 9, range: 7, fireRate: 6, accuracy: 8 } },
      { id: "famas", name: "FAMAS", stats: { damage: 8, range: 8, fireRate: 5, accuracy: 9 } },
      { id: "fal", name: "FAL", stats: { damage: 9, range: 9, fireRate: 4, accuracy: 9 } },
      { id: "masada", name: "ACR", stats: { damage: 6, range: 7, fireRate: 8, accuracy: 10 } },
      { id: "tar21", name: "TAR-21", stats: { damage: 8, range: 6, fireRate: 9, accuracy: 6 } },
      { id: "ak47", name: "AK-47", stats: { damage: 9, range: 7, fireRate: 6, accuracy: 6 } },
      { id: "f2000", name: "F2000", stats: { damage: 5, range: 5, fireRate: 10, accuracy: 5 } },
    ],
  },
  smg: {
    label: "— SMGs —",
    items: [
      { id: "mp5k", name: "MP5K", stats: { damage: 6, range: 4, fireRate: 9, accuracy: 5 } },
      { id: "ump45", name: "UMP45", stats: { damage: 9, range: 5, fireRate: 6, accuracy: 7 } },
      { id: "vector", name: "Vector", stats: { damage: 5, range: 4, fireRate: 10, accuracy: 8 } },
      { id: "p90", name: "P90", stats: { damage: 5, range: 5, fireRate: 9, accuracy: 6 } },
      { id: "uzi", name: "Mini-Uzi", stats: { damage: 6, range: 3, fireRate: 10, accuracy: 4 } },
    ],
  },
  lmg: {
    label: "— LMGs —",
    items: [
      { id: "rpd", name: "RPD", stats: { damage: 8, range: 8, fireRate: 7, accuracy: 6 } },
      { id: "mg4", name: "MG4", stats: { damage: 6, range: 9, fireRate: 8, accuracy: 8 } },
      { id: "sa80", name: "L86 LSW", stats: { damage: 8, range: 8, fireRate: 8, accuracy: 5 } },
      { id: "m240", name: "M240", stats: { damage: 6, range: 8, fireRate: 10, accuracy: 6 } },
      { id: "aug", name: "AUG HBAR", stats: { damage: 9, range: 7, fireRate: 7, accuracy: 7 } },
    ],
  },
  sniper: {
    label: "— Sniper Rifles —",
    items: [
      { id: "cheytac", name: "Intervention", stats: { damage: 10, range: 10, fireRate: 1, accuracy: 9 } },
      { id: "barrett", name: "Barrett .50cal", stats: { damage: 10, range: 10, fireRate: 3, accuracy: 8 } },
      { id: "wa2000", name: "WA2000", stats: { damage: 9, range: 10, fireRate: 4, accuracy: 8 } },
      { id: "m21", name: "M21 EBR", stats: { damage: 7, range: 9, fireRate: 6, accuracy: 9 } },
    ],
  },
  shotgun: {
    label: "— Shotguns —",
    items: [
      { id: "spas12", name: "SPAS-12", stats: { damage: 10, range: 3, fireRate: 2, accuracy: 2 } },
      { id: "aa12", name: "AA-12", stats: { damage: 7, range: 2, fireRate: 9, accuracy: 1 } },
      { id: "striker", name: "Striker", stats: { damage: 8, range: 2, fireRate: 5, accuracy: 2 } },
      { id: "ranger", name: "Ranger", stats: { damage: 10, range: 1, fireRate: 2, accuracy: 1 } },
      { id: "m1014", name: "M1014", stats: { damage: 8, range: 2, fireRate: 5, accuracy: 2 } },
    ],
  },
  other: {
    label: "— Other —",
    items: [{ id: "riotshield", name: "Riot Shield", stats: { damage: 2, range: 1, fireRate: 1, accuracy: 10 } }],
  },
  custom: {
    label: "— IW4x Custom —",
    items: [
      { id: "peacekeeper", name: "Peacekeeper", stats: { damage: 7, range: 6, fireRate: 8, accuracy: 8 } },
      { id: "ak47classic", name: "AK-47 Classic (CoD4)", stats: { damage: 9, range: 7, fireRate: 6, accuracy: 7 } },
    ],
  },

};

const SECONDARY_WEAPONS = {
  pistol: {
    label: "— Handguns —",
    items: [
      { id: "usp", name: "USP .45", stats: { damage: 5, range: 4, fireRate: 6, accuracy: 8 } },
      { id: "beretta393", name: "M9 (Beretta)", stats: { damage: 4, range: 4, fireRate: 7, accuracy: 8 } },
      { id: "coltanaconda", name: ".44 Magnum", stats: { damage: 9, range: 5, fireRate: 3, accuracy: 7 } },
      { id: "deserteagle", name: "Desert Eagle", stats: { damage: 9, range: 4, fireRate: 3, accuracy: 5 } },
      { id: "deserteaglegold", name: "Desert Eagle (Gold)", stats: { damage: 9, range: 4, fireRate: 3, accuracy: 5 } },
    ],
  },
  machine_pistol: {
    label: "— Machine Pistols —",
    items: [
      { id: "pp2000", name: "PP2000", stats: { damage: 7, range: 4, fireRate: 9, accuracy: 6 } },
      { id: "glock", name: "G18", stats: { damage: 5, range: 3, fireRate: 10, accuracy: 4 } },
      { id: "beretta93r", name: "M93 Raffica", stats: { damage: 7, range: 5, fireRate: 9, accuracy: 8 } },
      { id: "tmp", name: "TMP", stats: { damage: 5, range: 4, fireRate: 10, accuracy: 9 } },
    ],
  },
  shotgun: {
    label: "— Shotguns —",
    items: [
      { id: "spas12", name: "SPAS-12", stats: { damage: 10, range: 3, fireRate: 2, accuracy: 2 } },
      { id: "aa12", name: "AA-12", stats: { damage: 7, range: 2, fireRate: 9, accuracy: 1 } },
      { id: "striker", name: "Striker", stats: { damage: 8, range: 2, fireRate: 5, accuracy: 2 } },
      { id: "ranger", name: "Ranger", stats: { damage: 10, range: 1, fireRate: 2, accuracy: 1 } },
      { id: "m1014", name: "M1014", stats: { damage: 8, range: 2, fireRate: 5, accuracy: 2 } },
    ],
  },
  launcher: {
    label: "— Launchers —",
    items: [
      { id: "at4", name: "AT4-HS", stats: { damage: 10, range: 10, fireRate: 1, accuracy: 5 } },
      { id: "rpg", name: "RPG-7", stats: { damage: 10, range: 6, fireRate: 2, accuracy: 3 } },
      { id: "thumper", name: "Thumper", stats: { damage: 9, range: 5, fireRate: 2, accuracy: 4 } },
      { id: "javelin", name: "Javelin", stats: { damage: 10, range: 10, fireRate: 1, accuracy: 10 } },
      { id: "stinger", name: "Stinger", stats: { damage: 10, range: 10, fireRate: 1, accuracy: 10 } },
    ],
  },
  special: {
    label: "— Special —",
    items: [{ id: "onemanarmy", name: "One Man Army", stats: { damage: 0, range: 0, fireRate: 0, accuracy: 0 } }],
  },

};

const PRIMARY_ATTACHMENTS = [
  { id: "none", name: "None" },
  { id: "silencer", name: "Silencer" },
  { id: "fmj", name: "FMJ" },
  { id: "grip", name: "Grip" },
  { id: "rof", name: "Rapid Fire" },
  { id: "reflex", name: "Red Dot Sight" },
  { id: "acog", name: "ACOG Scope" },
  { id: "eotech", name: "Holographic Sight" },
  { id: "thermal", name: "Thermal Scope" },
  { id: "xmags", name: "Extended Mags" },
  { id: "gl", name: "Grenade Launcher" },
  { id: "shotgun", name: "Shotgun (Masterkey)" },
  { id: "heartbeat", name: "Heartbeat Sensor" },
];

const SECONDARY_ATTACHMENTS = [
  { id: "none", name: "None" },
  { id: "silencer", name: "Silencer" },
  { id: "fmj", name: "FMJ" },
  { id: "xmags", name: "Extended Mags" },
  { id: "akimbo", name: "Akimbo" },
  { id: "tactical", name: "Tactical Knife" },
  { id: "grip", name: "Grip" },
  { id: "rof", name: "Rapid Fire" },
  { id: "reflex", name: "Red Dot Sight" },
  { id: "eotech", name: "Holographic Sight" },
  { id: "acog", name: "ACOG Scope" },
];

const CAMOS = [
  { id: "none", name: "None" },
  { id: "desert", name: "Desert" },
  { id: "arctic", name: "Arctic" },
  { id: "woodland", name: "Woodland" },
  { id: "digital", name: "Digital" },
  { id: "urban", name: "Urban" },
  { id: "bluetiger", name: "Blue Tiger" },
  { id: "redtiger", name: "Red Tiger" },
  { id: "fall", name: "Fall" },
  { id: "gold", name: "Gold" },
];

// perks[0] = lethal equipment (NOT a perk!)
const EQUIPMENT = [
  { id: "frag_grenade_mp", name: "Frag Grenade" },
  { id: "semtex_mp", name: "Semtex" },
  { id: "throwingknife_mp", name: "Throwing Knife" },
  { id: "claymore_mp", name: "Claymore" },
  { id: "c4_mp", name: "C4" },
  { id: "oic_tactinsert_mp", name: "Tactical Insertion" },
  { id: "oic_flashbanggrenade_mp", name: "Blast Shield" },
];

// specialGrenade field — NO _mp suffix!
const SPECIAL_GRENADES = [
  { id: "concussion_grenade", name: "Stun Grenade" },
  { id: "flash_grenade", name: "Flash Grenade" },
  { id: "smoke_grenade", name: "Smoke Grenade" },
];

// perks[1] = Perk Slot 1
const PERKS_1 = [
  { id: "specialty_marathon", name: "Marathon" },
  { id: "specialty_marathon_pro", name: "Marathon Pro" },
  { id: "specialty_fastreload", name: "Sleight of Hand" },
  { id: "specialty_fastreload_pro", name: "Sleight of Hand Pro" },
  { id: "specialty_scavenger", name: "Scavenger" },
  { id: "specialty_scavenger_pro", name: "Scavenger Pro" },
  { id: "specialty_bling", name: "Bling" },
  { id: "specialty_bling_pro", name: "Bling Pro" },
  { id: "specialty_onemanarmy", name: "One Man Army" },
  { id: "specialty_onemanarmy_pro", name: "One Man Army Pro" },
];

// perks[2] = Perk Slot 2
const PERKS_2 = [
  { id: "specialty_bulletdamage", name: "Stopping Power" },
  { id: "specialty_bulletdamage_pro", name: "Stopping Power Pro" },
  { id: "specialty_lightweight", name: "Lightweight" },
  { id: "specialty_lightweight_pro", name: "Lightweight Pro" },
  { id: "specialty_hardline", name: "Hardline" },
  { id: "specialty_hardline_pro", name: "Hardline Pro" },
  { id: "specialty_coldblooded", name: "Cold-Blooded" },
  { id: "specialty_coldblooded_pro", name: "Cold-Blooded Pro" },
  { id: "specialty_explosivedamage", name: "Danger Close" },
  { id: "specialty_explosivedamage_pro", name: "Danger Close Pro" },
];

// perks[3] = Perk Slot 3
const PERKS_3 = [
  { id: "specialty_extendedmelee", name: "Commando" },
  { id: "specialty_extendedmelee_pro", name: "Commando Pro" },
  { id: "specialty_bulletaccuracy", name: "Steady Aim" },
  { id: "specialty_bulletaccuracy_pro", name: "Steady Aim Pro" },
  { id: "specialty_scrambler", name: "Scrambler" },
  { id: "specialty_scrambler_pro", name: "Scrambler Pro" },
  { id: "specialty_heartbreaker", name: "Ninja" },
  { id: "specialty_heartbreaker_pro", name: "Ninja Pro" },
  { id: "specialty_detectexplosive", name: "SitRep" },
  { id: "specialty_detectexplosive_pro", name: "SitRep Pro" },
  { id: "specialty_pistoldeath", name: "Last Stand" },
  { id: "specialty_pistoldeath_pro", name: "Last Stand Pro" },
];

// perks[4] = Deathstreak
const DEATHSTREAKS = [
  { id: "specialty_null", name: "None" },
  { id: "specialty_combathigh", name: "Painkiller" },
  { id: "specialty_grenadepulldeath", name: "Martyrdom" },
  { id: "specialty_finalstand", name: "Final Stand" },
  { id: "specialty_yourturn", name: "Copycat" },
];

// MW2 color codes: ^0 through ^7
const COLOR_CODES = {
  0: "#000000", // Black
  1: "#ff3131", // Red
  2: "#00ff00", // Green
  3: "#ffff00", // Yellow
  4: "#3b82f6", // Blue
  5: "#00ffff", // Cyan
  6: "#ff69b4", // Pink/Magenta
  7: "#ffffff", // White
};

// Build a flat set of all known weapon IDs for import validation
const ALL_WEAPON_IDS = new Set();
for (const cat of Object.values(WEAPONS)) {
  for (const w of cat.items) ALL_WEAPON_IDS.add(w.id);
}
for (const cat of Object.values(SECONDARY_WEAPONS)) {
  for (const w of cat.items) ALL_WEAPON_IDS.add(w.id);
}

// Build flat sets for validation during import
const ALL_PRIMARY_ATTACH_IDS = new Set(PRIMARY_ATTACHMENTS.map((a) => a.id));
const ALL_SECONDARY_ATTACH_IDS = new Set(
  SECONDARY_ATTACHMENTS.map((a) => a.id),
);
const ALL_CAMO_IDS = new Set(CAMOS.map((c) => c.id));
const ALL_EQUIPMENT_IDS = new Set(EQUIPMENT.map((e) => e.id));
const ALL_SPECIAL_GRENADE_IDS = new Set(SPECIAL_GRENADES.map((g) => g.id));
const ALL_PERK1_IDS = new Set(PERKS_1.map((p) => p.id));
const ALL_PERK2_IDS = new Set(PERKS_2.map((p) => p.id));
const ALL_PERK3_IDS = new Set(PERKS_3.map((p) => p.id));
const ALL_DEATHSTREAK_IDS = new Set(DEATHSTREAKS.map((d) => d.id));

const NUM_CLASSES = 15;

function getDefaultClass(i) {
  return {
    name: `Custom Class ${i + 1}`,
    primaryWeapon: "m4",
    primaryAttach1: "none",
    primaryAttach2: "none",
    primaryCamo: "none",
    secondaryWeapon: "usp",
    secondaryAttach1: "none",
    secondaryAttach2: "none",
    secondaryCamo: "none",
    equipment: "frag_grenade_mp",
    specialGrenade: "concussion_grenade",
    perk1: "specialty_marathon",
    perk2: "specialty_bulletdamage",
    perk3: "specialty_heartbreaker",
    deathstreak: "specialty_combathigh",
  };
}


