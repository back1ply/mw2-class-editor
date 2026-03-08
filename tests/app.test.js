'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parseCfgLines } = require('./helpers.js');

// Re-use getDefaultClass from the global set in helpers.js

describe('Reset behavior — name preservation', () => {

  it('reset current class preserves name, clears weapon', () => {
    // Simulate the correct reset pattern (what store.resetCurrent should do)
    const cls = Object.assign(getDefaultClass(0), {
      name: 'My Snipers',
      primaryWeapon: 'cheytac',
      perk1: 'marathon_mp'
    });

    const savedName = cls.name;
    Object.assign(cls, getDefaultClass(0));
    cls.name = savedName;

    assert.equal(cls.name, 'My Snipers');
    assert.equal(cls.primaryWeapon, 'none');
    assert.equal(cls.perk1, 'none');
  });

  it('reset all classes preserves all names', () => {
    // Build 3 classes with custom names and weapons
    const classes = [0, 1, 2].map(i => Object.assign(getDefaultClass(i), {
      name: `Custom ${i}`,
      primaryWeapon: 'm4',
    }));

    // Simulate resetAll with name preservation
    for (let i = 0; i < classes.length; i++) {
      const savedName = classes[i].name;
      Object.assign(classes[i], getDefaultClass(i));
      classes[i].name = savedName;
    }

    assert.equal(classes[0].name, 'Custom 0');
    assert.equal(classes[1].name, 'Custom 1');
    assert.equal(classes[2].name, 'Custom 2');
    assert.equal(classes[0].primaryWeapon, 'none');
  });

  it('reset with empty name falls back to default name', () => {
    // If user cleared their name to empty, reset should restore default name
    const cls = Object.assign(getDefaultClass(0), { name: '' });

    const savedName = cls.name;
    Object.assign(cls, getDefaultClass(0));
    // Only restore if non-empty
    if (savedName) cls.name = savedName;

    // Name should be the default since the saved name was empty
    assert.equal(cls.name, 'Custom Class 1');
  });

});

describe('CFG round-trip', () => {

  it('all fields survive generate → parse cycle', () => {
    // Build a known CFG string (mirrors generateCommandsForClass output)
    const idx = 3;
    const c = {
      name: 'Round Trip',
      primaryWeapon: 'ak47',
      primaryAttach1: 'silencer',
      primaryAttach2: 'acog_scope',
      primaryCamo: 'urban',
      secondaryWeapon: 'usp',
      secondaryAttach1: 'none',
      secondaryAttach2: 'none',
      secondaryCamo: 'woodland',
      equipment: 'frag_grenade_mp',
      specialGrenade: 'smoke_grenade_mp',
      perk1: 'marathon_mp',
      perk2: 'stopping_power_mp',
      perk3: 'ninja_mp',
      deathstreak: 'copycat_mp',
    };

    const lines = [
      `setPlayerData customClasses ${idx} name "${c.name}"`,
      `setPlayerData customClasses ${idx} weaponSetups 0 weapon ${c.primaryWeapon}`,
      `setPlayerData customClasses ${idx} weaponSetups 0 attachment 0 ${c.primaryAttach1}`,
      `setPlayerData customClasses ${idx} weaponSetups 0 attachment 1 ${c.primaryAttach2}`,
      `setPlayerData customClasses ${idx} weaponSetups 0 camo ${c.primaryCamo}`,
      `setPlayerData customClasses ${idx} weaponSetups 1 weapon ${c.secondaryWeapon}`,
      `setPlayerData customClasses ${idx} weaponSetups 1 attachment 0 ${c.secondaryAttach1}`,
      `setPlayerData customClasses ${idx} weaponSetups 1 attachment 1 ${c.secondaryAttach2}`,
      `setPlayerData customClasses ${idx} weaponSetups 1 camo ${c.secondaryCamo}`,
      `setPlayerData customClasses ${idx} perks 0 ${c.equipment}`,
      `setPlayerData customClasses ${idx} perks 1 ${c.perk1}`,
      `setPlayerData customClasses ${idx} perks 2 ${c.perk2}`,
      `setPlayerData customClasses ${idx} perks 3 ${c.perk3}`,
      `setPlayerData customClasses ${idx} perks 4 ${c.deathstreak}`,
      `setPlayerData customClasses ${idx} specialGrenade ${c.specialGrenade}`,
    ];

    const result = parseCfgLines(lines.join('\n').split('\n'));
    const parsed = result.classes[idx];

    assert.equal(parsed.name, c.name);
    assert.equal(parsed.primaryWeapon, c.primaryWeapon);
    assert.equal(parsed.primaryAttach1, c.primaryAttach1);
    assert.equal(parsed.primaryAttach2, c.primaryAttach2);
    assert.equal(parsed.primaryCamo, c.primaryCamo);
    assert.equal(parsed.secondaryWeapon, c.secondaryWeapon);
    assert.equal(parsed.secondaryAttach1, c.secondaryAttach1);
    assert.equal(parsed.secondaryAttach2, c.secondaryAttach2);
    assert.equal(parsed.secondaryCamo, c.secondaryCamo);
    assert.equal(parsed.equipment, c.equipment);
    assert.equal(parsed.specialGrenade, c.specialGrenade);
    assert.equal(parsed.perk1, c.perk1);
    assert.equal(parsed.perk2, c.perk2);
    assert.equal(parsed.perk3, c.perk3);
    assert.equal(parsed.deathstreak, c.deathstreak);
  });

});
