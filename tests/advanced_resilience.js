/**
 * @fileoverview Advanced Resilience Tests for MW2 Class Editor.
 * Verifies the app against real-world game logs and ensures security guardrails.
 */

const fs = require('fs');
const path = require('path');

// --- Mocking environment ---
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

// Mocking 'document' for escapeHTML test
const document = {
  createElement: () => ({
    set textContent(val) { this._text = val; },
    get innerHTML() {
      return this._text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  })
};

// --- Load Logic ---
const parserCode = fs.readFileSync(path.join(__dirname, '../js/parser.js'), 'utf8');
const utilsCode = fs.readFileSync(path.join(__dirname, '../js/utils/utils.js'), 'utf8');
eval(parserCode);
eval(utilsCode);

// --- Test Suite ---

function testRealLogParsing() {
  console.log('Testing parsing of sample_from_console_mp.log...');
  const logPath = path.join(__dirname, '../sample_from_console_mp.log');
  const logContent = fs.readFileSync(logPath, 'utf8');

  const result = parseConsoleLog(logContent);
  
  if (result.count === 0) throw new Error('Failed to extract classes from real log.');
  console.log(`✓ Real-world log parsing: PASS (Extracted ${result.count} classes)`);
  
  // Spot check first class (Custom Class 1)
  const class0 = result.classes[0];
  if (!class0.name) throw new Error('Class 0 name is missing.');
  console.log(`  - Class 0 check: "${class0.name}" (Weapon: ${class0.primaryWeapon})`);
}

function testSecuritySanitization() {
  console.log('Testing XSS security sanitization...');
  const malicious = '<script>alert("xss")</script><img src=x onerror=alert(1)>';
  const escaped = escapeHTML(malicious);

  if (escaped.includes('<script') || escaped.includes('<img')) {
    throw new Error('Security Error: escapeHTML failed to sanitize opening tags!');
  }
  
  if (!escaped.includes('&lt;script&gt;') && !escaped.includes('&lt;img')) {
    throw new Error('Security Error: escapeHTML did not correctly encode LT/GT symbols.');
  }

  
  console.log('✓ Security sanitization (XSS): PASS');
}

function runAll() {
  try {
    console.log('--- ADVANCED RESILIENCE SUITE ---');
    testRealLogParsing();
    testSecuritySanitization();
    console.log('--- ALL ADVANCED TESTS PASSED ---');
  } catch (err) {
    console.error(`\n✗ ADVANCED VERIFICATION FAILED`);
    console.error(err.stack || err.message);
    process.exit(1);
  }
}

runAll();
