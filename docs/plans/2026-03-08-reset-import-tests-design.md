# Design: Reset Name Preservation, Import Fix, Test Suite

**Date:** 2026-03-08
**Status:** Approved

---

## Problems Being Solved

1. **Reset wipes class names** — Both "Reset Current" and "Reset All" replace the entire class object via `getDefaultClass()`, destroying user-set names.
2. **Import broken** — Click-to-browse file input has no `change` listener (silent failure). After paste/drop import, `store.currentClassIndex` is not reset, causing tab highlight and form fields to show different classes.
3. **Test coverage is thin** — Two ad-hoc test files using `eval()` with no test runner, limited cases, and no app-logic coverage.

---

## Bug Fix: Reset Preserves Names

**Files:** `js/app.js`, `js/core/store.js`

- `resetAllClasses()` in `app.js`: for each class, save `name`, assign `getDefaultClass(i)`, restore `name`.
- `store.resetCurrent()` in `store.js`: save `name`, assign `getDefaultClass(idx)`, restore `name`.

No other behavior changes. Names persist; all loadout fields (weapons, perks, camo, attachments) reset to defaults.

---

## Bug Fix: Import

**File:** `js/app.js`

### File input (click-to-browse)
Add to `setupImport()`:
```js
const fileInput = $('fileInput');
if (fileInput) {
  fileInput.addEventListener('change', e => {
    if (e.target.files[0]) readAndImport(e.target.files[0]);
  });
}
```

### Tab/form sync after import
In both `importFromPaste()` and `readAndImport()`, replace:
```js
view.buildTabs();
view.updateActiveTab(0);
view.updateAll();
```
With:
```js
view.buildTabs();
store.switchClass(0);  // fires state:classSwitched → syncs tab + form + output
```

---

## Test Suite

### Approach
- **Node.js built-in `node:test`** — zero dependencies, proper test structure, colored output.
- `module.exports` guard added to `parser.js` and `utils.js` so they can be `require()`d cleanly in tests without `eval()`.
- Guard is safe for browsers: `if (typeof module !== 'undefined') module.exports = ...`

### Files

| Action | File |
|--------|------|
| Delete | `tests/parser_test.js` |
| Delete | `tests/advanced_resilience.js` |
| Create | `tests/helpers.js` — shared mock env |
| Create | `tests/parser.test.js` — all parser cases |
| Create | `tests/app.test.js` — reset + output + round-trip |
| Create/update | `package.json` — add `"test"` script |

### `tests/helpers.js`
Exports: `NUM_CLASSES`, `getDefaultClass()`, mock `document` (for `escapeHTML`), loaded `parseConsoleLog`, `parseCfgLines`, `escapeHTML`, `formatMW2Colors`.

### `tests/parser.test.js` coverage
- Tree format: basic name + weapon, all perks, attachments, camo, timestamps stripped, partial data (missing classes default), 15-class full parse
- CFG format: all `setPlayerData` fields, quoted names, attachment indices
- Edge cases: empty string, garbage text, mixed tree+CFG prefers tree

### `tests/app.test.js` coverage
- Reset: name preserved after `resetCurrent`, name preserved after `resetAll`, loadout fields are defaults after reset
- Output generation: `generateCommandsForClass` produces correct command strings for all 15 fields
- Round-trip: generate commands for a class → parse via `parseCfgLines` → same data back

### Running tests
```sh
node --test tests/*.test.js
```

`package.json` test script:
```json
"scripts": {
  "test": "node --test tests/*.test.js"
}
```

---

## Success Criteria

- Reset All/Current: class names survive, all other fields return to defaults
- File input click-to-browse triggers import correctly
- After any import, tab 0 is active and form shows class 0 data
- `node --test tests/*.test.js` runs all tests and passes
- No `eval()` in test files
- Existing browser behavior unchanged
