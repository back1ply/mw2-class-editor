'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parseConsoleLog, parseCfgLines } = require('./helpers.js');

describe('parseConsoleLog — tree format', () => {

  it('parses class name and primary weapon', () => {
    const log = `
customClasses
  [0]
    name = "Sniper"
    weaponSetups
      [0]
        weapon = cheytac
`;
    const r = parseConsoleLog(log);
    assert.equal(r.count, 1);
    assert.equal(r.classes[0].name, 'Sniper');
    assert.equal(r.classes[0].primaryWeapon, 'cheytac');
  });

  it('parses all perk slots', () => {
    const log = `
customClasses
  [0]
    name = "Perker"
    perks
      [0] = frag_grenade_mp
      [1] = marathon_mp
      [2] = stopping_power_mp
      [3] = ninja_mp
      [4] = copycat_mp
`;
    const r = parseConsoleLog(log);
    const c = r.classes[0];
    assert.equal(c.equipment, 'frag_grenade_mp');
    assert.equal(c.perk1, 'marathon_mp');
    assert.equal(c.perk2, 'stopping_power_mp');
    assert.equal(c.perk3, 'ninja_mp');
    assert.equal(c.deathstreak, 'copycat_mp');
  });

  it('parses primary and secondary attachments', () => {
    const log = `
customClasses
  [0]
    name = "Blinged"
    weaponSetups
      [0]
        weapon = m4
        attachment
          [0] = silencer
          [1] = acog_scope
      [1]
        weapon = usp
        attachment
          [0] = silencer
          [1] = none
`;
    const r = parseConsoleLog(log);
    const c = r.classes[0];
    assert.equal(c.primaryAttach1, 'silencer');
    assert.equal(c.primaryAttach2, 'acog_scope');
    assert.equal(c.secondaryWeapon, 'usp');
    assert.equal(c.secondaryAttach1, 'silencer');
    assert.equal(c.secondaryAttach2, 'none');
  });

  it('parses camo and specialGrenade', () => {
    const log = `
customClasses
  [0]
    name = "Camo"
    weaponSetups
      [0]
        weapon = ak47
        camo = urban
      [1]
        weapon = usp
        camo = woodland
    specialGrenade = concussion_grenade_mp
`;
    const r = parseConsoleLog(log);
    const c = r.classes[0];
    assert.equal(c.primaryCamo, 'urban');
    assert.equal(c.secondaryCamo, 'woodland');
    assert.equal(c.specialGrenade, 'concussion_grenade_mp');
  });

  it('strips console timestamps', () => {
    const log = `
[  18215383] customClasses
[  18215384]   [0]
[  18215385]     name = "Timestamped"
[  18215386]     weaponSetups
[  18215387]       [0]
[  18215388]         weapon = famas
`;
    const r = parseConsoleLog(log);
    assert.equal(r.classes[0].name, 'Timestamped');
    assert.equal(r.classes[0].primaryWeapon, 'famas');
  });

  it('returns 15 classes total with defaults for missing ones', () => {
    const log = `
customClasses
  [0]
    name = "Only One"
`;
    const r = parseConsoleLog(log);
    assert.equal(r.classes.length, 15);
    assert.equal(r.count, 1);
    assert.equal(r.classes[0].name, 'Only One');
    assert.equal(r.classes[1].name, 'Custom Class 2');
  });

  it('parses multiple classes', () => {
    const log = `
customClasses
  [0]
    name = "Alpha"
  [1]
    name = "Bravo"
  [2]
    name = "Charlie"
`;
    const r = parseConsoleLog(log);
    assert.equal(r.count, 3);
    assert.equal(r.classes[0].name, 'Alpha');
    assert.equal(r.classes[1].name, 'Bravo');
    assert.equal(r.classes[2].name, 'Charlie');
  });

});

describe('parseCfgLines — CFG format', () => {

  it('parses setPlayerData name command', () => {
    const log = `setPlayerData customClasses 0 name "My Class"`;
    const r = parseConsoleLog(log);
    assert.equal(r.count, 1);
    assert.equal(r.classes[0].name, 'My Class');
  });

  it('parses primary weapon and camo', () => {
    const log = [
      'setPlayerData customClasses 0 weaponSetups 0 weapon m4',
      'setPlayerData customClasses 0 weaponSetups 0 camo urban',
    ].join('\n');
    const r = parseConsoleLog(log);
    assert.equal(r.classes[0].primaryWeapon, 'm4');
    assert.equal(r.classes[0].primaryCamo, 'urban');
  });

  it('parses attachment indices', () => {
    const log = [
      'setPlayerData customClasses 0 weaponSetups 0 attachment 0 silencer',
      'setPlayerData customClasses 0 weaponSetups 0 attachment 1 acog_scope',
      'setPlayerData customClasses 0 weaponSetups 1 attachment 0 akimbo_mp',
    ].join('\n');
    const r = parseConsoleLog(log);
    const c = r.classes[0];
    assert.equal(c.primaryAttach1, 'silencer');
    assert.equal(c.primaryAttach2, 'acog_scope');
    assert.equal(c.secondaryAttach1, 'akimbo_mp');
  });

  it('parses all perk indices', () => {
    const log = [
      'setPlayerData customClasses 0 perks 0 frag_grenade_mp',
      'setPlayerData customClasses 0 perks 1 marathon_mp',
      'setPlayerData customClasses 0 perks 2 stopping_power_mp',
      'setPlayerData customClasses 0 perks 3 ninja_mp',
      'setPlayerData customClasses 0 perks 4 copycat_mp',
    ].join('\n');
    const r = parseConsoleLog(log);
    const c = r.classes[0];
    assert.equal(c.equipment, 'frag_grenade_mp');
    assert.equal(c.perk1, 'marathon_mp');
    assert.equal(c.perk2, 'stopping_power_mp');
    assert.equal(c.perk3, 'ninja_mp');
    assert.equal(c.deathstreak, 'copycat_mp');
  });

  it('parses specialGrenade', () => {
    const log = 'setPlayerData customClasses 2 specialGrenade smoke_grenade_mp';
    const r = parseConsoleLog(log);
    assert.equal(r.classes[2].specialGrenade, 'smoke_grenade_mp');
  });

  it('parses multiple class indices', () => {
    const log = [
      'setPlayerData customClasses 0 name "Alpha"',
      'setPlayerData customClasses 4 name "Epsilon"',
      'setPlayerData customClasses 14 name "Last"',
    ].join('\n');
    const r = parseConsoleLog(log);
    assert.equal(r.count, 3);
    assert.equal(r.classes[0].name, 'Alpha');
    assert.equal(r.classes[4].name, 'Epsilon');
    assert.equal(r.classes[14].name, 'Last');
  });

});

describe('parseConsoleLog — edge cases', () => {

  it('returns 15 defaults and count 0 for empty string', () => {
    const r = parseConsoleLog('');
    assert.equal(r.count, 0);
    assert.equal(r.classes.length, 15);
    assert.equal(r.classes[0].primaryWeapon, 'none');
  });

  it('returns count 0 for garbage input', () => {
    const r = parseConsoleLog('hello world\nfoo bar baz\n12345');
    assert.equal(r.count, 0);
  });

  it('prefers tree format over CFG when both present', () => {
    const log = `
customClasses
  [0]
    name = "Tree Name"
setPlayerData customClasses 0 name "CFG Name"
`;
    const r = parseConsoleLog(log);
    assert.equal(r.classes[0].name, 'Tree Name');
  });

});
