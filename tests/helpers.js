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
