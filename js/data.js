// =====================================================
//  MW2 / IW4x — Complete Game Data Reference
//  Technical Stats Source: DenKirson (2009), Sym.gg
//  All internal IDs verified from actual getPlayerData
// =====================================================

const WEAPONS = {
  assault: {
    label: "— Assault Rifles —",
    items: [
      { id: "m4", name: "M4A1", stats: { damageMax: 30, damageMin: 20, range: 1500, rpm: 789 } },
      { id: "m16", name: "M16A4", stats: { damageMax: 40, damageMin: 30, range: 2000, rpm: 459 } },
      { id: "scar", name: "SCAR-H", stats: { damageMax: 40, damageMin: 30, range: 1600, rpm: 625 } },
      { id: "famas", name: "FAMAS", stats: { damageMax: 40, damageMin: 30, range: 2000, rpm: 459 } },
      { id: "fal", name: "FAL", stats: { damageMax: 55, damageMin: 35, range: 2000, rpm: 625 } },
      { id: "masada", name: "ACR", stats: { damageMax: 30, damageMin: 20, range: 2000, rpm: 789 } },
      { id: "tar21", name: "TAR-21", stats: { damageMax: 40, damageMin: 30, range: 1200, rpm: 750 } },
      { id: "ak47", name: "AK-47", stats: { damageMax: 40, damageMin: 30, range: 1600, rpm: 705 } },
      { id: "f2000", name: "F2000", stats: { damageMax: 30, damageMin: 20, range: 1000, rpm: 909 } },
    ],
  },
  smg: {
    label: "— SMGs —",
    items: [
      { id: "mp5k", name: "MP5K", stats: { damageMax: 40, damageMin: 20, range: 800, rpm: 857 } },
      { id: "ump45", name: "UMP45", stats: { damageMax: 40, damageMin: 35, range: 1000, rpm: 666 } },
      { id: "vector", name: "Vector", stats: { damageMax: 25, damageMin: 20, range: 800, rpm: 1111 } },
      { id: "p90", name: "P90", stats: { damageMax: 30, damageMin: 20, range: 1000, rpm: 923 } },
      { id: "uzi", name: "Mini-Uzi", stats: { damageMax: 30, damageMin: 20, range: 800, rpm: 952 } },
    ],
  },
  lmg: {
    label: "— LMGs —",
    items: [
      { id: "rpd", name: "RPD", stats: { damageMax: 40, damageMin: 40, range: 9999, rpm: 705 } },
      { id: "mg4", name: "MG4", stats: { damageMax: 30, damageMin: 30, range: 9999, rpm: 857 } },
      { id: "sa80", name: "L86 LSW", stats: { damageMax: 40, damageMin: 40, range: 9999, rpm: 789 } },
      { id: "m240", name: "M240", stats: { damageMax: 30, damageMin: 30, range: 9999, rpm: 952 } },
      { id: "aug", name: "AUG HBAR", stats: { damageMax: 40, damageMin: 40, range: 9999, rpm: 705 } },
    ],
  },
  sniper: {
    label: "— Sniper Rifles —",
    items: [
      { id: "cheytac", name: "Intervention", stats: { damageMax: 70, damageMin: 70, range: 9999, rpm: 38 } },
      { id: "barrett", name: "Barrett .50cal", stats: { damageMax: 70, damageMin: 70, range: 9999, rpm: 1200 } },
      { id: "wa2000", name: "WA2000", stats: { damageMax: 70, damageMin: 70, range: 9999, rpm: 1200 } },
      { id: "m21", name: "M21 EBR", stats: { damageMax: 70, damageMin: 70, range: 9999, rpm: 1200 } },
    ],
  },
  other: {
    label: "— Other —",
    items: [{ id: "riotshield", name: "Riot Shield", stats: { damageMax: 50, damageMin: 50, range: 0, rpm: 1 } }],
  },
  custom: {
    label: "— IW4x Custom —",
    items: [
      { id: "peacekeeper", name: "Peacekeeper", stats: { damageMax: 33, damageMin: 22, range: 1200, rpm: 750 } },
      { id: "ak47classic", name: "AK-47 Classic (CoD4)", stats: { damageMax: 30, damageMin: 20, range: 1600, rpm: 705 } },
    ],
  },

};

const SECONDARY_WEAPONS = {
  pistol: {
    label: "— Handguns —",
    items: [
      { id: "usp", name: "USP .45", stats: { damageMax: 40, damageMin: 25, range: 800, rpm: 625 } },
      { id: "beretta393", name: "M9 (Beretta)", stats: { damageMax: 40, damageMin: 25, range: 800, rpm: 750 } },
      { id: "coltanaconda", name: ".44 Magnum", stats: { damageMax: 50, damageMin: 35, range: 1000, rpm: 459 } },
      { id: "deserteagle", name: "Desert Eagle", stats: { damageMax: 50, damageMin: 30, range: 800, rpm: 459 } },
      { id: "deserteaglegold", name: "Desert Eagle (Gold)", stats: { damageMax: 50, damageMin: 30, range: 800, rpm: 459 } },
    ],
  },
  machine_pistol: {
    label: "— Machine Pistols —",
    items: [
      { id: "pp2000", name: "PP2000", stats: { damageMax: 40, damageMin: 20, range: 800, rpm: 857 } },
      { id: "glock", name: "G18", stats: { damageMax: 30, damageMin: 20, range: 500, rpm: 1111 } },
      { id: "beretta93r", name: "M93 Raffica", stats: { damageMax: 40, damageMin: 30, range: 1000, rpm: 459 } },
      { id: "tmp", name: "TMP", stats: { damageMax: 30, damageMin: 20, range: 800, rpm: 923 } },
    ],
  },
  shotgun: {
    label: "— Shotguns —",
    items: [
      { id: "spas12", name: "SPAS-12", stats: { damageMax: "40x8", damageMin: "20x8", range: 600, rpm: 72 } },
      { id: "aa12", name: "AA-12", stats: { damageMax: "20x8", damageMin: "15x8", range: 400, rpm: 400 } },
      { id: "striker", name: "Striker", stats: { damageMax: "25x8", damageMin: "15x8", range: 500, rpm: 300 } },
      { id: "ranger", name: "Ranger", stats: { damageMax: "75x8", damageMin: "30x8", range: 300, rpm: 150 } },
      { id: "m1014", name: "M1014", stats: { damageMax: "30x8", damageMin: "20x8", range: 600, rpm: 300 } },
    ],
  },
  launcher: {
    label: "— Launchers —",
    items: [
      { id: "at4", name: "AT4-HS", stats: { damageMax: 200, damageMin: 200, range: 9999, rpm: 1 } },
      { id: "rpg", name: "RPG-7", stats: { damageMax: 200, damageMin: 200, range: 9999, rpm: 1 } },
      { id: "thumper", name: "Thumper", stats: { damageMax: 200, damageMin: 200, range: 800, rpm: 60 } },
      { id: "javelin", name: "Javelin", stats: { damageMax: 300, damageMin: 300, range: 9999, rpm: 1 } },
      { id: "stinger", name: "Stinger", stats: { damageMax: 300, damageMin: 300, range: 9999, rpm: 1 } },
    ],
  },
  special: {
    label: "— Special —",
    items: [{ id: "onemanarmy", name: "One Man Army", stats: { damageMax: 0, damageMin: 0, range: 0, rpm: 0 } }],
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

// MW2 color codes: ^0 through ^9 and ^:
const COLOR_CODES = {
  0: "#000000", // Black
  1: "#ff3131", // Red
  2: "#00ff00", // Green
  3: "#ffff00", // Yellow
  4: "#3b82f6", // Blue
  5: "#00ffff", // Cyan
  6: "#ff69b4", // Pink/Magenta
  7: "#ffffff", // White
  8: "#00a09e", // Team Color (Teal Fallback)
  9: "#808080", // Grey
  ':': "#ff00ff" // Rainbow (Magenta Fallback)
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
  return JSON.parse(JSON.stringify({
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
  }));
}

// Map UI element IDs to state object keys
const FIELD_MAP = {
  'className': 'name',
  'primaryWeapon': 'primaryWeapon',
  'primaryAttach1': 'primaryAttach1',
  'primaryAttach2': 'primaryAttach2',
  'primaryCamo': 'primaryCamo',
  'secondaryWeapon': 'secondaryWeapon',
  'secondaryAttach1': 'secondaryAttach1',
  'secondaryAttach2': 'secondaryAttach2',
  'secondaryCamo': 'secondaryCamo',
  'equipment': 'equipment',
  'specialGrenade': 'specialGrenade',
  'perk1': 'perk1',
  'perk2': 'perk2',
  'perk3': 'perk3',
  'deathstreak': 'deathstreak'
};

// Map internal perk IDs to image filenames
const PERK_ICON_MAP = {
  'specialty_marathon': 'marathon',
  'specialty_marathon_pro': 'marathon',
  'specialty_fastreload': 'sleight_of_hand',
  'specialty_fastreload_pro': 'sleight_of_hand',
  'specialty_scavenger': 'scavenger',
  'specialty_scavenger_pro': 'scavenger',
  'specialty_bling': 'bling',
  'specialty_bling_pro': 'bling',
  'specialty_onemanarmy': 'one_man_army',
  'specialty_onemanarmy_pro': 'one_man_army',
  'specialty_bulletdamage': 'stopping_power',
  'specialty_bulletdamage_pro': 'stopping_power',
  'specialty_lightweight': 'lightweight',
  'specialty_lightweight_pro': 'lightweight',
  'specialty_hardline': 'hardline',
  'specialty_hardline_pro': 'hardline',
  'specialty_coldblooded': 'cold_blooded',
  'specialty_coldblooded_pro': 'cold_blooded',
  'specialty_explosivedamage': 'danger_close',
  'specialty_explosivedamage_pro': 'danger_close',
  'specialty_extendedmelee': 'commando',
  'specialty_extendedmelee_pro': 'commando',
  'specialty_bulletaccuracy': 'steady_aim',
  'specialty_bulletaccuracy_pro': 'steady_aim',
  'specialty_scrambler': 'scrambler',
  'specialty_scrambler_pro': 'scrambler',
  'specialty_heartbreaker': 'ninja',
  'specialty_heartbreaker_pro': 'ninja',
  'specialty_detectexplosive': 'sitrep',
  'specialty_detectexplosive_pro': 'sitrep',
  'specialty_pistoldeath': 'last_stand',
  'specialty_pistoldeath_pro': 'last_stand'
};

// Map internal equipment IDs to image filenames
const EQUIP_ICON_MAP = {
  'frag_grenade_mp': 'frag_grenade',
  'semtex_mp': 'semtex',
  'throwingknife_mp': 'throwing_knife',
  'claymore_mp': 'claymore',
  'c4_mp': 'c4',
  'oic_tactinsert_mp': 'tactical_insertion',
  'oic_flashbanggrenade_mp': 'blast_shield'
};

// Map internal deathstreak IDs to image filenames
const DEATHSTREAK_ICON_MAP = {
  'specialty_combathigh': 'painkiller',
  'specialty_grenadepulldeath': 'martyrdom',
  'specialty_finalstand': 'final_stand',
  'specialty_yourturn': 'copycat'
};

// Map internal tactical grenade IDs to image filenames
const TACTICAL_ICON_MAP = {
  'concussion_grenade': 'stun_grenade',
  'flash_grenade': 'flash_grenade',
  'smoke_grenade': 'smoke_grenade'
};


