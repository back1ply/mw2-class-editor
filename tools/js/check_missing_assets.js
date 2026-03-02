const fs = require('fs');
const path = require('path');

/**
 * Audit script to check for missing icons required by app.js / data.js
 */

// Terminal colors
const R = '\x1b[31m';
const G = '\x1b[32m';
const Y = '\x1b[33m';
const C = '\x1b[36m';
const W = '\x1b[0m';

// Minimal representations from data.js
const weaponIds = [
  'm4','m16','scar','famas','fal','masada','tar21','ak47','f2000',
  'mp5k','ump45','vector','p90','uzi',
  'rpd','mg4','sa80','m240','aug',
  'cheytac','barrett','wa2000','m21',
  'spas12','aa12','striker','ranger','m1014',
  'riotshield','peacekeeper','ak47classic',
  'usp','coltanaconda','m1911','deserteagle','m9',
  'pp2000','glock','beretta393','tmp',
  'at4','thumper','stinger','javelin','rpg'
];

const perkIds = [
  'marathon','sleight_of_hand','scavenger','bling','one_man_army',
  'stopping_power','lightweight','hardline','cold_blooded','danger_close',
  'commando','steady_aim','scrambler','ninja','sitrep','last_stand'
];
const perkProIds = perkIds.map(p => p + '_pro');

const equipMap = {
  frag_grenade_mp: 'frag_grenade', semtex_mp: 'semtex',
  throwingknife_mp: 'throwing_knife', claymore_mp: 'claymore',
  c4_mp: 'c4', flare_mp: 'tactical_insertion',
  blastshield_mp: 'blast_shield'
};
const tactMap = {
  stun_grenade_mp: 'stun_grenade', flash_grenade_mp: 'flash_grenade',
  smoke_grenade_mp: 'smoke_grenade'
};
const dsMap = {
  specialty_null: 'none', specialty_combathigh: 'painkiller',
  specialty_grenadepulldeath: 'martyrdom', specialty_finalstand: 'final_stand',
  specialty_yourturn: 'copycat'
};

let totalChecked = 0;
let totalMissing = 0;

function check(dir, names) {
  const missing = [];
  console.log(`\n${C}=== Checking ${dir} ===${W}`);
  names.forEach(n => {
    if (!n) return;
    totalChecked++;
    const p = path.join(__dirname, '..', 'img', dir, n + '.png');
    if (!fs.existsSync(p)) missing.push(n);
  });
  
  if (missing.length === 0) {
    console.log(`  ${G}✓ All ${names.length} icons present.${W}`);
  } else {
    totalMissing += missing.length;
    console.log(`  ${R}✗ Missing ${missing.length} icons:${W}`);
    missing.forEach(m => console.log(`    - ${m}.png`));
  }
}

console.log(`${Y}Starting MW2 Class Editor Asset Audit...${W}`);

check('weapons', weaponIds);
check('perks', [...perkIds, ...perkProIds]);
check('equipment', Object.values(equipMap));
check('tactical', Object.values(tactMap));
check('deathstreaks', Object.values(dsMap));

console.log(`\n${C}=== Summary ===${W}`);
const found = totalChecked - totalMissing;
const color = totalMissing === 0 ? G : (found > 0 ? Y : R);
console.log(`Total Inspected: ${totalChecked}`);
console.log(`Found: ${G}${found}${W}`);
console.log(`Missing: ${R}${totalMissing}${W}`);
if (totalMissing === 0) {
  console.log(`\n${G}✨ All base assets verified and ready! ✨${W}\n`);
} else {
  console.log(`\n${Y}Note: Missing files like custom IW4x weapons or none.png need manual placement.${W}\n`);
}

