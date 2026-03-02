/**
 * @fileoverview Basic regression tests for the console log parser.
 * Run this with 'node tests/parser_test.js' to verify parsing logic.
 */

const fs = require('fs');
const path = require('path');

// Mock DOM/Window dependencies for node environment if needed
const NUM_CLASSES = 15;
function getDefaultClass(i) {
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
}

// Load the parser code
const parserCode = fs.readFileSync(path.join(__dirname, '../js/parser.js'), 'utf8');
eval(parserCode); 

function runTests() {
  console.log('--- Running Parser Tests ---');

  const sampleLog = `
customClasses
  [0]
    name = "Test Class 1"
    weaponSetups
      [0]
        weapon = m4
  [1]
    name = "Test Class 2"
`;

  try {
    const result = parseConsoleLog(sampleLog);
    
    if (result.count !== 2) throw new Error(`Expected 2 classes, got ${result.count}`);


    if (result.classes[0].name !== 'Test Class 1') throw new Error(`Name mismatch: ${result.classes[0].name}`);
    if (result.classes[0].primaryWeapon !== 'm4') throw new Error(`Weapon mismatch: ${result.classes[0].primaryWeapon}`);

    console.log('✓ Basic tree parsing: PASS');
  } catch (err) {
    console.error('✗ Basic tree parsing: FAIL');
    console.error(err.message);
    process.exit(1);
  }

  console.log('--- All Tests Passed ---');
}

runTests();
