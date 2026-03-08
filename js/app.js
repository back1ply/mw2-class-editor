/**
 * @fileoverview Main Entry Point for MW2 Class Editor.
 * Orchestrates the coordination between state, view, and external data.
 */

// =====================================================
//  STATE
// =====================================================

let outputMode = 'current';

// =====================================================
//  INIT
// =====================================================

/**
 * Main initialization function.
 * Called when the scripts are loaded.
 */
function init() {
  // 1. Initialize State
  store.init();
  
  // 2. Initialize UI View
  view.init();
  
  // 3. Setup Import logic
  setupImport();
  setupColorPreview();
  
  // 4. Generate first output
  generateOutput();

  // Helper for manual debugging/experimentation
  window.MW2_RELOAD_UI = () => {
    view.updateAll();
    generateOutput();
  };
}

// =====================================================
//  DROPDOWN HELPERS
// =====================================================

function populateWeaponSelect(id, weaponData) {
  const sel = $(id);
  if (!sel) return;
  sel.innerHTML = '';
  for (const cat of Object.values(weaponData)) {
    const group = document.createElement('optgroup');
    group.label = cat.label;
    for (const w of cat.items) {
      const opt = document.createElement('option');
      opt.value = w.id;
      opt.textContent = w.name;
      group.appendChild(opt);
    }
    sel.appendChild(group);
  }
}

function populateSelect(id, items) {
  const sel = $(id);
  if (!sel) return;
  sel.innerHTML = '';
  for (const item of items) {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.name;
    sel.appendChild(opt);
  }
}

// =====================================================
//  COMMAND GENERATION
// =====================================================

/**
 * Generates raw console commands for a specific class index.
 * @param {number} idx - Class index (0-14).
 * @returns {string[]} Array of setPlayerData commands.
 */
function generateCommandsForClass(idx) {
  const c = store.classes[idx];
  return [
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
}

/**
 * Generates and displays the final command output in the UI.
 */
function generateOutput() {
  const outputEl = $('output');
  const readableEl = $('outputReadable');

  if (outputMode === 'all') {
    const allLines = [];
    for (let i = 0; i < NUM_CLASSES; i++) {
        allLines.push(`// --- Class ${i + 1}: ${store.classes[i].name} ---`);
        allLines.push(...generateCommandsForClass(i));
        allLines.push('');
    }
    outputEl.textContent = allLines.join('; ');
    if (readableEl) readableEl.textContent = allLines.join('\n');
  } else {
    const cmds = generateCommandsForClass(store.currentClassIndex);
    outputEl.textContent = cmds.join('; ');
    if (readableEl) readableEl.textContent = cmds.join('\n');
  }

  store.save();
}

/**
 * Toggles the output display mode.
 * @param {'current' | 'all'} mode 
 */
function setOutputMode(mode) {
  outputMode = mode;
  document.querySelectorAll('.output-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  generateOutput();
}

// =====================================================
//  EVENT HANDLERS
// =====================================================

const onFieldChange = debounce(() => {
  // Map UI values back to state
  for (const [elId, key] of Object.entries(FIELD_MAP)) {
    const el = $(elId);
    if (el) store.classes[store.currentClassIndex][key] = el.value;
  }
  
  // Trigger notifications
  events.emit('state:changed');
}, 150);

function resetCurrentClass() {
  store.resetCurrent();
  showToast('Class reset to defaults', 'info');
}

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

function generateUnlockAll() {
  const cmds = ['unlockstats', 'setPlayerData prestige 10', 'setPlayerData experience 2516000'];
  $('output').textContent = cmds.join('; ');
  showToast('Unlock commands generated', 'info');
}

// =====================================================
//  COLOR PREVIEW
// =====================================================

function setupColorPreview() {
  const input = $('className');
  if (input) input.addEventListener('input', updateColorPreview);
}

function updateColorPreview() {
  const preview = $('colorPreview');
  const input = $('className');
  if (!preview || !input) return;

  const text = input.value;
  if (!text) {
    preview.innerHTML = '<span class="color-hint">Type a name to preview colors...</span>';
    return;
  }

  preview.innerHTML = '';
  const parts = text.split(/(\^\d)/);
  let currentColor = COLOR_CODES['7'];

  for (const part of parts) {
    const codeMatch = part.match(/^\^(\d)$/);
    if (codeMatch) {
      const code = codeMatch[1];
      if (COLOR_CODES[code]) currentColor = COLOR_CODES[code];
      continue;
    }
    if (part.length > 0) {
      const span = document.createElement('span');
      span.style.color = currentColor;
      span.textContent = part;
      preview.appendChild(span);
    }
  }
}

// =====================================================
//  IMPORT / EXPORT
// =====================================================

function toggleImportPanel() {
  const panel = $('importPanel');
  const btn = $('importToggleBtn');
  if (!panel || !btn) return;
  const isVisible = panel.classList.toggle('visible');
  btn.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
}

function importFromPaste() {
  const textarea = $('pasteArea');
  const resultEl = $('importResult');
  if (!textarea) return;

  const text = textarea.value.trim();
  if (!text) {
    if (resultEl) {
      resultEl.textContent = 'Paste some log content first.';
      resultEl.className = 'import-result error';
    }
    return;
  }

  const result = parseConsoleLog(text);
  if (result.count > 0) {
    store.classes = result.classes;
    store.save();
    view.buildTabs();
    view.updateActiveTab(0);
    view.updateAll();
    generateOutput();
    if (resultEl) {
      resultEl.textContent = `Imported ${result.count} class${result.count !== 1 ? 'es' : ''} successfully.`;
      resultEl.className = 'import-result success';
    }
    showToast(`Imported ${result.count} classes`, 'success');
  } else {
    if (resultEl) {
      resultEl.textContent = 'No class data found. Make sure you pasted output from /dumpPlayerData.';
      resultEl.className = 'import-result error';
    }
    showToast('No class data found', 'info');
  }
}

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

function readAndImport(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = parseConsoleLog(e.target.result);
    if (result.count > 0) {
      store.classes = result.classes;
      store.save();
      view.buildTabs();
      view.updateActiveTab(0);
      view.updateAll();
      generateOutput();
      showToast(`Imported ${result.count} classes`, 'success');
    }
  };
  reader.readAsText(file);
}

function downloadCfg(mode) {
  let lines = [];
  if (mode === 'current') {
    lines = generateCommandsForClass(store.currentClassIndex);
  } else {
    for (let i = 0; i < NUM_CLASSES; i++) {
        lines.push(`// --- Class ${i + 1} ---`);
        lines.push(...generateCommandsForClass(i));
        lines.push('');
    }
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = mode === 'all' ? 'all_classes.cfg' : 'class.cfg';
  a.click();
}

async function copyCommands() {
  const text = $('output').textContent;
  await navigator.clipboard.writeText(text);
  showToast('Copied!', 'success');
}

function showToast(message, type = 'success') {
  const toast = $('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 2500);
}

const $ = (id) => document.getElementById(id);

// Start the app
init();
