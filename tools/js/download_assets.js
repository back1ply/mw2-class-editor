const fs = require('fs');
const https = require('http'); // Themodernwarfare2.com uses HTTP
const path = require('path');

/**
 * MW2 Icon Downloader Script
 * Scrapes weapon, perk, equipment, and deathstreak icons directly from themodernwarfare2.com.
 * To use: Run `node download_assets.js` in the project root.
 */

const destBase = path.join(__dirname, '..', 'img');

// We list the base name used in the URL URL on themodernwarfare2.com, and the localName 
// which maps to the ID expected by app.js / data.js.
const assets = [
    // --- Weapons ---
    { type: 'weapon', urlName: 'm4a1', localName: 'm4' },
    { type: 'weapon', urlName: 'famas', localName: 'famas' },
    { type: 'weapon', urlName: 'scar-h', localName: 'scar' },
    { type: 'weapon', urlName: 'tar-21', localName: 'tar21' },
    { type: 'weapon', urlName: 'fal', localName: 'fal' },
    { type: 'weapon', urlName: 'm16a4', localName: 'm16' },
    { type: 'weapon', urlName: 'acr', localName: 'masada' }, // ACR mapped to masada
    { type: 'weapon', urlName: 'f2000', localName: 'f2000' },
    { type: 'weapon', urlName: 'ak-47', localName: 'ak47' },
    
    { type: 'weapon', urlName: 'mp5k', localName: 'mp5k' },
    { type: 'weapon', urlName: 'ump45', localName: 'ump45' },
    { type: 'weapon', urlName: 'vector', localName: 'vector' },
    { type: 'weapon', urlName: 'p90', localName: 'p90' },
    { type: 'weapon', urlName: 'mini-uzi', localName: 'uzi' },
    
    { type: 'weapon', urlName: 'l86-lsw', localName: 'sa80' },
    { type: 'weapon', urlName: 'rpd', localName: 'rpd' },
    { type: 'weapon', urlName: 'mg4', localName: 'mg4' },
    { type: 'weapon', urlName: 'aug-hbar', localName: 'aug' },
    { type: 'weapon', urlName: 'm240', localName: 'm240' },
    
    { type: 'weapon', urlName: 'intervention', localName: 'cheytac' },
    { type: 'weapon', urlName: 'barrett-50cal', localName: 'barrett' },
    { type: 'weapon', urlName: 'wa2000', localName: 'wa2000' },
    { type: 'weapon', urlName: 'm21-ebr', localName: 'm21' },
    
    { type: 'weapon', urlName: 'spas-12', localName: 'spas12' },
    { type: 'weapon', urlName: 'aa-12', localName: 'aa12' },
    { type: 'weapon', urlName: 'striker', localName: 'striker' },
    { type: 'weapon', urlName: 'ranger', localName: 'ranger' },
    { type: 'weapon', urlName: 'm1014', localName: 'm1014' },
    { type: 'weapon', urlName: 'model-1887', localName: 'winchester1200' }, // Mapping Model 1887 to winchester1200
    
    { type: 'weapon', urlName: 'usp-45', localName: 'usp' },
    { type: 'weapon', urlName: '44-magnum', localName: 'coltanaconda' },
    { type: 'weapon', urlName: 'm1911', localName: 'm1911' },
    { type: 'weapon', urlName: 'desert-eagle', localName: 'deserteagle' },
    { type: 'weapon', urlName: 'm9', localName: 'm9' },
    
    { type: 'weapon', urlName: 'pp2000', localName: 'pp2000' },
    { type: 'weapon', urlName: 'g18', localName: 'glock' },
    { type: 'weapon', urlName: 'm93-raffica', localName: 'beretta393' }, // Raffica mapped to beretta393
    { type: 'weapon', urlName: 'tmp', localName: 'tmp' },
    
    { type: 'weapon', urlName: 'at4-hs', localName: 'at4' },
    { type: 'weapon', urlName: 'thumper', localName: 'thumper' },
    { type: 'weapon', urlName: 'stinger', localName: 'stinger' },
    { type: 'weapon', urlName: 'javelin', localName: 'javelin' },
    { type: 'weapon', urlName: 'rpg-7', localName: 'rpg' },
    
    { type: 'weapon', urlName: 'riot-shield', localName: 'riotshield' },

    // --- Perks ---
    { type: 'perk', urlName: 'marathon', localName: 'marathon' },
    { type: 'perk', urlName: 'sleight-of-hand', localName: 'sleight_of_hand' },
    { type: 'perk', urlName: 'scavenger', localName: 'scavenger' },
    { type: 'perk', urlName: 'bling', localName: 'bling' },
    { type: 'perk', urlName: 'one-man-army', localName: 'one_man_army' },
    { type: 'perk', urlName: 'stopping-power', localName: 'stopping_power' },
    { type: 'perk', urlName: 'lightweight', localName: 'lightweight' },
    { type: 'perk', urlName: 'hardline', localName: 'hardline' },
    { type: 'perk', urlName: 'cold-blooded', localName: 'cold_blooded' },
    { type: 'perk', urlName: 'danger-close', localName: 'danger_close' },
    { type: 'perk', urlName: 'commando', localName: 'commando' },
    { type: 'perk', urlName: 'steady-aim', localName: 'steady_aim' },
    { type: 'perk', urlName: 'scrambler', localName: 'scrambler' },
    { type: 'perk', urlName: 'ninja', localName: 'ninja' },
    { type: 'perk', urlName: 'sitrep', localName: 'sitrep' },
    { type: 'perk', urlName: 'last-stand', localName: 'last_stand' },

    // --- Equipment ---
    { type: 'equip', urlName: 'frag', localName: 'frag_grenade' },
    { type: 'equip', urlName: 'semtex', localName: 'semtex' },
    { type: 'equip', urlName: 'throwing-knife', localName: 'throwing_knife' },
    { type: 'equip', urlName: 'tactical-insertion', localName: 'tactical_insertion' },
    { type: 'equip', urlName: 'blast-shield', localName: 'blast_shield' },
    { type: 'equip', urlName: 'claymore', localName: 'claymore' },
    { type: 'equip', urlName: 'c4', localName: 'c4' },

    // --- Tactical ---
    { type: 'tactical', urlName: 'stun-grenade', localName: 'stun_grenade' },
    { type: 'tactical', urlName: 'flash-grenade', localName: 'flash_grenade' },
    { type: 'tactical', urlName: 'smoke-grenade', localName: 'smoke_grenade' },

    // --- Deathstreaks ---
    { type: 'deathstreak', urlName: 'copycat', localName: 'copycat' },
    { type: 'deathstreak', urlName: 'painkiller', localName: 'painkiller' },
    { type: 'deathstreak', urlName: 'martyrdom', localName: 'martyrdom' },
    { type: 'deathstreak', urlName: 'final-stand', localName: 'final_stand' },

    // --- Attachments ---
    { type: 'attachment', urlName: 'silencer', localName: 'silencer' },
    { type: 'attachment', urlName: 'fmj', localName: 'fmj' },
    { type: 'attachment', urlName: 'grip', localName: 'grip' },
    { type: 'attachment', urlName: 'rapid-fire', localName: 'rof' },
    { type: 'attachment', urlName: 'red-dot-sight', localName: 'reflex' },
    { type: 'attachment', urlName: 'holographic-sight', localName: 'eotech' },
    { type: 'attachment', urlName: 'acog-scope', localName: 'acog' },
    { type: 'attachment', urlName: 'thermal-scope', localName: 'thermal' },
    { type: 'attachment', urlName: 'extended-mags', localName: 'xmags' },
    { type: 'attachment', urlName: 'grenade-launcher', localName: 'gl' },
    { type: 'attachment', urlName: 'shotgun', localName: 'shotgun' },
    { type: 'attachment', urlName: 'heartbeat-sensor', localName: 'heartbeat' },
    { type: 'attachment', urlName: 'akimbo', localName: 'akimbo' },
    { type: 'attachment', urlName: 'tactical-knife', localName: 'tactical' },

    // --- Camos ---
    { type: 'camo', urlName: 'desert', localName: 'desert' },
    { type: 'camo', urlName: 'arctic', localName: 'arctic' },
    { type: 'camo', urlName: 'woodland', localName: 'woodland' },
    { type: 'camo', urlName: 'digital', localName: 'digital' },
    { type: 'camo', urlName: 'urban', localName: 'urban' },
    { type: 'camo', urlName: 'blue-tiger', localName: 'bluetiger' },
    // --- Killstreaks ---
    { type: 'killstreak', urlName: 'uav', localName: 'uav' },
    { type: 'killstreak', urlName: 'care-package', localName: 'care_package' },
    { type: 'killstreak', urlName: 'counter-uav', localName: 'counter_uav' },
    { type: 'killstreak', urlName: 'sentry-gun', localName: 'sentry_gun' },
    { type: 'killstreak', urlName: 'predator-missile', localName: 'predator_missile' },
    { type: 'killstreak', urlName: 'precision-airstrike', localName: 'precision_airstrike' },
    { type: 'killstreak', urlName: 'harrier-strike', localName: 'harrier_strike' },
    { type: 'killstreak', urlName: 'attack-helicopter', localName: 'attack_helicopter' },
    { type: 'killstreak', urlName: 'emergency-airdrop', localName: 'emergency_airdrop' },
    { type: 'killstreak', urlName: 'pave-low', localName: 'pave_low' },
    { type: 'killstreak', urlName: 'stealth-bomber', localName: 'stealth_bomber' },
    { type: 'killstreak', urlName: 'chopper-gunner', localName: 'chopper_gunner' },
    { type: 'killstreak', urlName: 'ac-130', localName: 'ac130' },
    { type: 'killstreak', urlName: 'emp', localName: 'emp' },
    { type: 'killstreak', urlName: 'tactical-nuke', localName: 'nuke' }
];

['weapons', 'perks', 'equipment', 'deathstreaks', 'tactical', 'attachments', 'camos', 'killstreaks'].forEach(dir => {
    fs.mkdirSync(path.join(destBase, dir), { recursive: true });
});

async function downloadAsset(url, dest) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const file = fs.createWriteStream(dest);
                res.pipe(file);
                file.on('finish', () => { file.close(); resolve(true); });
            } else {
                resolve(false);
            }
        }).on('error', () => resolve(false));
    });
}

async function run() {
    let successCount = 0;
    
    for (const item of assets) {
        let urlsToTry = [];
        let destFolder = '';
        
        switch (item.type) {
            case 'weapon':
                destFolder = 'weapons';
                urlsToTry = [
                    `http://www.themodernwarfare2.com/images/mw2/weapons/${item.urlName}-small.jpg`,
                    `http://www.themodernwarfare2.com/images/mw2/weapons/${item.urlName}-prev.jpg`,
                    `http://www.themodernwarfare2.com/images/mw2/weapons/${item.urlName}.jpg`
                ];
                break;
            case 'perk':
                destFolder = 'perks';
                urlsToTry = [`http://www.themodernwarfare2.com/images/mw2/perks/${item.urlName}-perk.jpg`];
                break;
            case 'equip':
                destFolder = 'equipment';
                urlsToTry = [`http://www.themodernwarfare2.com/images/mw2/equipment/equipment-${item.urlName}.jpg`];
                break;
            case 'deathstreak':
                destFolder = 'deathstreaks';
                urlsToTry = [`http://www.themodernwarfare2.com/images/mw2/deathstreaks/deathstreak-${item.urlName}.jpg`];
                break;
            case 'attachment':
                destFolder = 'attachments';
                urlsToTry = [`http://www.themodernwarfare2.com/images/mw2/weapons/attachment-${item.urlName}.jpg`];
                break;
            case 'camo':
                destFolder = 'camos';
                urlsToTry = [`http://www.themodernwarfare2.com/images/mw2/weapons/camo-${item.urlName}.jpg`];
                break;
            case 'tactical':
                destFolder = 'tactical';
                urlsToTry = [`http://www.themodernwarfare2.com/images/mw2/special-grenades/special-${item.urlName}.jpg`];
                break;
            case 'killstreak':
                destFolder = 'killstreaks';
                urlsToTry = [`http://www.themodernwarfare2.com/images/mw2/killstreaks/killstreak-${item.urlName}.jpg`];
                break;
        }

        const destPath = path.join(destBase, destFolder, `${item.localName}.png`); // Save everything as .png for app.js
        console.log(`Downloading ${item.urlName}...`);

        let downloaded = false;
        for (const url of urlsToTry) {
            if (downloaded) break;
            const ok = await downloadAsset(url, destPath);
            if (ok) {
                console.log(`  -> Saved to ${destFolder}/${item.localName}.png`);
                successCount++;
                downloaded = true;
                
                // For perks, duplicate base perk to _pro version since this site doesn't have unique Pro icons
                // The Class Editor data.js requires _pro versions to exist to avoid 404s
                if (item.type === 'perk') {
                    const proDest = path.join(destBase, destFolder, `${item.localName}_pro.png`);
                    fs.copyFileSync(destPath, proDest);
                    successCount++;
                }
            }
        }
        
        if (!downloaded) {
             console.log(`  FAILED to download ${item.urlName}. Checked: ${urlsToTry.join(', ')}`);
        }
    }
    
    console.log(`\nDone! Successfully saved ${successCount} files.`);
}

run();
