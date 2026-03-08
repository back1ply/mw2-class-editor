# MW2 Class Editor

[![Live Demo](https://img.shields.io/badge/demo-online-orange)](https://back1ply.github.io/mw2-class-editor/)

A fast, web-based loadout editor for MW2 / IW4x. No more manual `/setPlayerData` commands—configure your classes here and export them instantly.

## Features

- **Log Importer**: Load your current classes from `/dumpPlayerData` — drag & drop, click to browse, or paste directly.
- **GSC Exporter**: Generate an `initClasses()` script to use in your mods.
- **Stats Simulator**: See real Damage, Range, and Rate of Fire as you build.
- **Color Codes**: Live preview for `^1`–`^7` colors in class names.
- **Reset**: Reset current or all classes — custom names are preserved.

## Usage

1. Open the [Live Demo](https://back1ply.github.io/mw2-class-editor/).
2. Tweak your 15 classes.
3. Use the **Export GSC** button for modding, or copy the commands for the console.

### Importing from game

1. Open IW4x console (`~`) and run `/dumpPlayerData`
2. Open `console_mp.log` from your IW4x folder
3. In the editor, open **Import from Console Log** and drag the file, click to browse, or paste the contents

## For Developers

Clean, modular JS with zero dependencies.

- `js/core/store.js` — state management
- `js/core/exporter.js` — GSC generation
- `js/parser.js` — console log / CFG parser
- `js/data.js` — weapon and perk database

Run tests:
```bash
node --test tests/*.test.js
```

## Credits
Built by [back1ply](https://github.com/back1ply).
MIT License.
