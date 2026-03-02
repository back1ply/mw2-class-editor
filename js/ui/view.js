/**
 * @fileoverview UI View Layer for MW2 Class Editor.
 * Handles DOM manipulation, icon rendering, and user event listeners.
 */

const view = {
  /**
   * Initializes the UI components.
   */
  init() {
    this.buildTabs();
    this.populateDropdowns();
    this.setupEventListeners();
    this.updateAll();
  },

  /**
   * Builds the class selection tabs.
   */
  buildTabs() {
    const container = $('classTabs');
    if (!container) return;
    
    container.innerHTML = '';
    for (let i = 0; i < NUM_CLASSES; i++) {
      const tab = document.createElement('button');
      tab.className = 'class-tab' + (i === store.currentClassIndex ? ' active' : '');
      tab.textContent = i + 1;
      tab.setAttribute('role', 'tab');
      tab.title = store.classes[i].name.replace(/\^\d/g, '');
      tab.onclick = () => store.switchClass(i);
      container.appendChild(tab);
    }
  },

  /**
   * Populates all weapon and perk dropdowns from data.js.
   */
  populateDropdowns() {
    populateWeaponSelect('primaryWeapon', WEAPONS);
    populateWeaponSelect('secondaryWeapon', SECONDARY_WEAPONS);
    populateSelect('primaryAttach1', PRIMARY_ATTACHMENTS);
    populateSelect('primaryAttach2', PRIMARY_ATTACHMENTS);
    populateSelect('secondaryAttach1', SECONDARY_ATTACHMENTS);
    populateSelect('secondaryAttach2', SECONDARY_ATTACHMENTS);
    populateSelect('primaryCamo', CAMOS);
    populateSelect('secondaryCamo', CAMOS);
    populateSelect('equipment', EQUIPMENT);
    populateSelect('specialGrenade', SPECIAL_GRENADES);
    populateSelect('perk1', PERKS_1);
    populateSelect('perk2', PERKS_2);
    populateSelect('perk3', PERKS_3);
    populateSelect('deathstreak', DEATHSTREAKS);
  },

  /**
   * Sets up global event listeners.
   */
  setupEventListeners() {
    // Sync UI with state changes
    events.on('state:classSwitched', (idx) => {
      this.updateActiveTab(idx);
      this.updateFormFields(idx);
      this.updateIcons();
      generateOutput();
    });

    events.on('state:changed', () => {
      generateOutput();
      updateColorPreview();
      this.updateIcons();
    });

    events.on('state:classReset', (idx) => {
        this.updateFormFields(idx);
        this.updateIcons();
        generateOutput();
    });
  },

  /**
   * Updates the active tab styling.
   * @param {number} activeIdx 
   */
  updateActiveTab(activeIdx) {
    document.querySelectorAll('.class-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i === activeIdx);
    });
  },

  /**
   * Fills form fields with data from a specific class.
   * @param {number} idx 
   */
  updateFormFields(idx) {
    const c = store.classes[idx];
    for (const [elId, key] of Object.entries(FIELD_MAP)) {
      const el = $(elId);
      if (el) el.value = c[key] || '';
    }
    updateColorPreview();
  },

  /**
   * Updates weapon and perk icons based on current selection.
   */
  updateIcons() {
    // Primary weapon
    const pw = $('primaryWeapon');
    const pwIcon = $('primaryWeaponIcon');
    if (pw && pwIcon) {
      const id = pw.value;
      pwIcon.src = `img/weapons/${id}.png`;
      pwIcon.onerror = function() { this.src = ''; };
      this.renderWeaponStats(id, 'primaryStats');
    }

    // Secondary weapon
    const sw = $('secondaryWeapon');
    const swIcon = $('secondaryWeaponIcon');
    if (sw && swIcon) {
      const id = sw.value;
      swIcon.src = `img/weapons/${id}.png`;
      swIcon.onerror = function() { this.src = ''; };
      this.renderWeaponStats(id, 'secondaryStats');
    }


    // Equipment
    const eq = $('equipment');
    const eqIcon = $('equipmentIcon');
    if (eq && eqIcon) {
      const iconName = EQUIP_ICON_MAP[eq.value] || '';
      eqIcon.src = iconName ? `img/equipment/${iconName}.png` : '';
      eqIcon.onerror = function() { this.src = ''; };
    }

    // Tactical
    const tac = $('specialGrenade');
    const tacIcon = $('tacticalIcon');
    if (tac && tacIcon) {
      const iconName = TACTICAL_ICON_MAP[tac.value] || '';
      tacIcon.src = iconName ? `img/tactical/${iconName}.png` : '';
      tacIcon.onerror = function() { this.src = ''; };
    }

    // Deathstreak
    const ds = $('deathstreak');
    const dsIcon = $('deathstreakIcon');
    if (ds && dsIcon) {
      const iconName = DEATHSTREAK_ICON_MAP[ds.value] || '';
      dsIcon.src = iconName ? `img/deathstreaks/${iconName}.png` : '';
      dsIcon.onerror = function() { this.src = ''; };
    }

    // Perks
    for (let i = 1; i <= 3; i++) {
      const perkSel = $(`perk${i}`);
      const perkIcon = $(`perk${i}Icon`);
      if (perkSel && perkIcon) {
        const perkId = perkSel.value;
        const iconName = PERK_ICON_MAP[perkId] || '';
        perkIcon.src = iconName ? `img/perks/${iconName}.png` : '';
        perkIcon.onerror = function() { this.src = ''; };
        perkIcon.classList.toggle('pro', perkId.endsWith('_pro'));
      }
    }
  },

  /**
   * Full UI refresh.
   */
  updateAll() {
    this.updateFormFields(store.currentClassIndex);
    this.updateIcons();
    updateColorPreview();
  },

   /**
   * Renders weapon statistics to a container.
   * @param {string} weaponId 
   * @param {string} containerId 
   */
  renderWeaponStats(weaponId, containerId) {
    const container = $(containerId);
    if (!container) return;

    const weapon = this.findWeaponById(weaponId);
    if (!weapon || !weapon.stats) {
      container.innerHTML = '';
      return;
    }

    const { stats } = weapon;
    
    // Hide stats for items with no combat value (like One Man Army)
    if (stats.damageMax === 0 && stats.damageMin === 0) {
      container.innerHTML = '';
      return;
    }

    const damageVal = stats.damageMax === stats.damageMin 
      ? stats.damageMax 
      : `${stats.damageMax}-${stats.damageMin}`;

    const rpmVal = stats.rpm === 1 ? 'Single Shot' : (stats.rpm === 0 ? 'N/A' : `${stats.rpm} RPM`);
    const rangeVal = stats.range === 9999 ? 'Infinite' : (stats.range === 0 ? 'N/A' : `${stats.range} units`);

    // Technical Data Rendering
    const fields = [
      { label: 'DAMAGE', value: damageVal },
      { label: 'RPM', value: rpmVal },
      { label: 'RANGE', value: rangeVal }
    ];

    container.innerHTML = fields.map(f => `
      <div class="stat-row technical">
        <label class="stat-label">${f.label}:</label>
        <span class="stat-value">${f.value}</span>
      </div>
    `).join('');
  },

  /**
   * Helper to find weapon object by ID in data pools.
   * @param {string} id 
   */
  findWeaponById(id) {
    for (const cat of Object.values(WEAPONS)) {
      const w = cat.items.find(i => i.id === id);
      if (w) return w;
    }
    for (const cat of Object.values(SECONDARY_WEAPONS)) {
      const w = cat.items.find(i => i.id === id);
      if (w) return w;
    }
    return null;
  },

  /**
   * Shows the GSC export modal with generated code.
   */
  showExportModal() {
    const modal = $('exportModal');
    const codeArea = $('exportCode');
    if (modal && codeArea) {
      codeArea.value = exporter.generateGSC();
      modal.classList.add('active');
    }
  },

  /**
   * Hides the GSC export modal.
   */
  hideExportModal() {
    const modal = $('exportModal');
    if (modal) modal.classList.remove('active');
  },

  /**
   * Copies modal code to clipboard.
   */
  copyExportCode() {
    const codeArea = $('exportCode');
    if (codeArea) {
      codeArea.select();
      document.execCommand('copy');
      showToast('GSC Script copied to clipboard!');
    }
  }
};

