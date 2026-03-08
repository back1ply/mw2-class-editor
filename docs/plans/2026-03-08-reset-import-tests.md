# Reset Name Preservation, Import Fix, Test Suite Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix reset to preserve class names, fix broken file import, and build a proper test suite using Node's built-in test runner.

**Architecture:** Add `module.exports` guards to parser.js and utils.js so they can be required in Node tests. Write tests first where possible (TDD for reset fix). Tests live in `tests/` and use `node:test` + `node:assert` — zero dependencies.

**Tech Stack:** Vanilla JS, Node.js 24 built-in `node:test`, `node:assert`

---

## Task 1: Add module.exports guard to parser.js

**Files:**
- Modify: `js/parser.js` (append at end of file)

**Step 1: Append export guard**

Open `js/parser.js` and add at the very end (after all function definitions):

```js
// Allow requiring in Node.js tests without breaking browser usage
if (typeof module !== 'undefined') {
  module.exports = { parseConsoleLog, parseCfgLines };
}
```

**Step 2: Verify browser is unaffected**

Open `index.html` in browser, check console — no errors, app loads normally.

**Step 3: Commit**

```bash
git add js/parser.js
git commit -m "chore: add module.exports guard to parser for testability"
```

---

## Task 2: Add module.exports guard to utils.js

**Files:**
- Modify: `js/utils/utils.js` (append at end of file)

**Step 1: Append export guard**

Open `js/utils/utils.js` and add at the very end:

```js
// Allow requiring in Node.js tests without breaking browser usage
if (typeof module !== 'undefined') {
  module.exports = { escapeHTML, debounce, events, formatMW2Colors };
}
```

**Step 2: Commit**

```bash
git add js/utils/utils.js
git commit -m "chore: add module.exports guard to utils for testability"
```

---

## Task 3: Create package.json and test helper

**Files:**
- Create: `package.json`
- Create: `tests/helpers.js`

**Step 1: Create package.json**

```json
{
  "name": "mw2-class-editor",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "node --test tests/*.test.js"
  }
}
```

**Step 2: Create tests/helpers.js**

```js
'use strict';

// Set up globals that parser.js and utils.js expect from the browser environment
global.NUM_CLASSES = 15;

global.getDefaultClass = function(i) {
  return {
    name: `Custom Class ${i + 1}`,
    primaryWeapon: 'none',
    primaryAttach1: 'none',
    primaryAttach2: 'none',
    primaryCamo: 'none',
    secondaryWeapon: 'none',
    secondaryAttach1: 'none',
    secondaryAttach2: 'none',
    secondaryCamo: 'none',
    equipment: 'none',
    specialGrenade: 'none',
    perk1: 'none',
    perk2: 'none',
    perk3: 'none',
    deathstreak: 'none'
  };
};

// Mock document for escapeHTML (utils.js uses document.createElement)
global.document = {
  createElement: () => ({
    set textContent(val) { this._text = val; },
    get innerHTML() {
      return (this._text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  })
};

// Load modules (globals must be set first)
const { parseConsoleLog, parseCfgLines } = require('../js/parser.js');
const { escapeHTML } = require('../js/utils/utils.js');

module.exports = { parseConsoleLog, parseCfgLines, escapeHTML };
```

**Step 3: Verify helper loads without error**

```bash
node -e "require('./tests/helpers.js'); console.log('OK')"
```

Expected output: `OK`

**Step 4: Commit**

```bash
git add package.json tests/helpers.js
git commit -m "test: add package.json and test helper environment"
```

---

## Task 4: Write and run parser tree-format tests

**Files:**
- Create: `tests/parser.test.js`

**Step 1: Create tests/parser.test.js**

```js
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
    assert.equal(r.classes[1].name, 'Custom Class 2');  // default
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
    // Tree format takes priority when customClasses header exists
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
```

**Step 2: Run tests**

```bash
node --test tests/parser.test.js
```

Expected: All tests pass (green). If any fail, the parser has a bug — stop and investigate before continuing.

**Step 3: Commit**

```bash
git add tests/parser.test.js
git commit -m "test: add parser unit tests for tree, CFG, and edge cases"
```

---

## Task 5: Write failing reset tests (TDD)

**Files:**
- Create: `tests/app.test.js`

**Step 1: Create tests/app.test.js with reset tests**

```js
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
    assert.equal(parsed.secondaryCamo, c.secondaryCamo);
    assert.equal(parsed.equipment, c.equipment);
    assert.equal(parsed.specialGrenade, c.specialGrenade);
    assert.equal(parsed.perk1, c.perk1);
    assert.equal(parsed.perk2, c.perk2);
    assert.equal(parsed.perk3, c.perk3);
    assert.equal(parsed.deathstreak, c.deathstreak);
  });

});
```

**Step 2: Run tests — expect the reset tests to PASS (logic is correct, they test the pattern)**

```bash
node --test tests/app.test.js
```

Expected: All pass. These tests validate the fix pattern — the actual code changes come next.

**Step 3: Commit**

```bash
git add tests/app.test.js
git commit -m "test: add reset name preservation and CFG round-trip tests"
```

---

## Task 6: Fix reset — preserve class names in store.js

**Files:**
- Modify: `js/core/store.js`

**Step 1: Find and update resetCurrent()**

Current code in `store.js` (~line 106):
```js
resetCurrent() {
  const idx = this.currentClassIndex;
  this.classes[idx] = getDefaultClass(idx);
  events.emit('state:classReset', idx);
}
```

Replace with:
```js
resetCurrent() {
  const idx = this.currentClassIndex;
  const savedName = this.classes[idx].name;
  this.classes[idx] = getDefaultClass(idx);
  if (savedName) this.classes[idx].name = savedName;
  events.emit('state:classReset', idx);
}
```

**Step 2: Verify test still passes**

```bash
node --test tests/app.test.js
```

Expected: All pass.

**Step 3: Commit**

```bash
git add js/core/store.js
git commit -m "fix: reset current class preserves custom name"
```

---

## Task 7: Fix reset — preserve class names in app.js

**Files:**
- Modify: `js/app.js`

**Step 1: Find and update resetAllClasses()**

Current code in `app.js` (~line 162):
```js
function resetAllClasses() {
  if (!confirm('Reset ALL 15 classes?')) return;
  for (let i = 0; i < NUM_CLASSES; i++) store.classes[i] = getDefaultClass(i);
  store.save();
  view.updateAll();
  generateOutput();
  showToast('All classes reset', 'info');
}
```

Replace the loop with:
```js
function resetAllClasses() {
  if (!confirm('Reset ALL 15 classes?')) return;
  for (let i = 0; i < NUM_CLASSES; i++) {
    const savedName = store.classes[i].name;
    store.classes[i] = getDefaultClass(i);
    if (savedName) store.classes[i].name = savedName;
  }
  store.save();
  view.buildTabs();
  view.updateAll();
  generateOutput();
  showToast('All classes reset', 'info');
}
```

Note: `view.buildTabs()` is added so tab labels refresh after names are preserved.

**Step 2: Manual verification**

1. Open `index.html` in browser
2. Change class name to something custom (e.g., "My Snipers")
3. Click "Reset Current" → name should remain "My Snipers", weapon/perks reset
4. Click "Reset All" → all names preserved, confirm dialog appears, after confirm all loadouts reset

**Step 3: Commit**

```bash
git add js/app.js
git commit -m "fix: reset all classes preserves custom names"
```

---

## Task 8: Fix import — wire fileInput change event

**Files:**
- Modify: `js/app.js`

**Step 1: Find setupImport() (~line 264)**

Current:
```js
function setupImport() {
  const dropZone = $('dropZone');
  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) readAndImport(file);
    });
  }
}
```

Replace with:
```js
function setupImport() {
  const dropZone = $('dropZone');
  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) readAndImport(file);
    });
  }

  const fileInput = $('fileInput');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) readAndImport(file);
    });
  }
}
```

**Step 2: Manual verification**

1. Open `index.html`, open import panel
2. Click the drop zone area (triggers file browser)
3. Select a `.log` or `.cfg` file → should import

**Step 3: Commit**

```bash
git add js/app.js
git commit -m "fix: wire fileInput change event for click-to-browse import"
```

---

## Task 9: Fix import — sync tab and form after import

**Files:**
- Modify: `js/app.js`

**Step 1: Find importFromPaste() (~line 228)**

Current (after successful parse):
```js
store.classes = result.classes;
store.save();
view.buildTabs();
view.updateActiveTab(0);
view.updateAll();
generateOutput();
```

Replace with:
```js
store.classes = result.classes;
store.save();
view.buildTabs();
store.switchClass(0);
```

`store.switchClass(0)` fires `state:classSwitched` → the event listener in `view.setupEventListeners()` handles tab highlight + form fields + `generateOutput()` in one synchronized path.

**Step 2: Find readAndImport() (~line 276)**

Current (inside `reader.onload`):
```js
store.classes = result.classes;
store.save();
view.buildTabs();
view.updateActiveTab(0);
view.updateAll();
generateOutput();
showToast(`Imported ${result.count} classes`, 'success');
```

Replace with:
```js
store.classes = result.classes;
store.save();
view.buildTabs();
store.switchClass(0);
showToast(`Imported ${result.count} classes`, 'success');
```

**Step 3: Manual verification**

1. Navigate to class 5 (click its tab)
2. Open import panel, paste valid log content, click Import
3. Tab 1 should become active, form should show class 1 data
4. Repeat with file drop/browse

**Step 4: Commit**

```bash
git add js/app.js
git commit -m "fix: sync tab and form after import via store.switchClass(0)"
```

---

## Task 10: Delete old test files and run full suite

**Files:**
- Delete: `tests/parser_test.js`
- Delete: `tests/advanced_resilience.js`

**Step 1: Delete old files**

```bash
git rm tests/parser_test.js tests/advanced_resilience.js
```

**Step 2: Run complete test suite**

```bash
node --test tests/*.test.js
```

Expected: All tests pass. Count should be 16+ individual test cases across both files.

**Step 3: Commit**

```bash
git commit -m "test: remove old eval-based test files, replaced by node:test suite"
```

---

## Task 11: Update memory and verify

**Step 1: Run tests one final time**

```bash
node --test tests/*.test.js
```

Expected output: all tests pass, no failures.

**Step 2: Open browser, do full manual smoke test**

- [ ] App loads, no console errors
- [ ] Change class name → tab label updates live
- [ ] Reset Current → name preserved, weapons/perks reset
- [ ] Reset All → all names preserved, confirm dialog works
- [ ] Import panel → click drop zone → file browser opens
- [ ] Paste import → imports and shows class 1 data with tab 1 active
- [ ] File drop import → same result

**Step 3: Final commit if any loose files**

```bash
git status
# commit anything uncommitted
```

---

## Success Criteria

- `node --test tests/*.test.js` runs clean with 0 failures
- No `eval()` in any test file
- Reset preserves names in both "reset current" and "reset all" paths
- Click-to-browse file import works
- After any import, tab 1 is active and form shows class 1 data
- Browser console shows no errors on load
