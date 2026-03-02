# MW2 Class Editor

[![Live Demo](https://img.shields.io/badge/demo-online-orange)](https://back1ply.github.io/mw2-class-editor/)

A fast, web-based loadout editor for MW2 / IW4x. No more manual `/setPlayerData` commands—configure your classes here and export them instantly.

## Functions

- **GSC Exporter**: Generate an `initClasses()` script to use in your mods.
- **Stats Simulator**: See real Damage, Range, Fast Rate, and Accuracy bars as you build.
- **Log Importer**: Drag and drop your `console_mp.log` (after running `/dumpPlayerData`) to load your current in-game setup.
- **Color Codes**: Live preview for `^1`-`^7` colors in class names.

## Usage

1. Open the [Live Demo](https://back1ply.github.io/mw2-class-editor/).
2. Tweak your 15 classes.
3. Use the **Export GSC** button for modding, or copy the commands for the console.

## For Developers

Clean, modular JS with zero dependencies. 
- `js/core/store.js`: Handles state.
- `js/core/exporter.js`: GSC generation logic.
- `js/data.js`: The weapon/perk database.

Run security tests:
```bash
node tests/advanced_resilience.js
```

## Credits
Built by [back1ply](https://github.com/back1ply).
MIT License.
