/**
 * @fileoverview Central State Store for MW2 Class Editor.
 * Manages class data, persistence, and change notifications.
 */

/**
 * @typedef {Object} LoadoutClass
 * @property {string} name - The custom class name (supports color codes).
 * @property {string} primaryWeapon - ID of the primary weapon.
 * @property {string} primaryAttach1 - ID of the first attachment.
 * @property {string} primaryAttach2 - ID of the second attachment (requires Bling).
 * @property {string} primaryCamo - ID of the camouflage.
 * @property {string} secondaryWeapon - ID of the secondary weapon.
 * @property {string} secondaryAttach1 - ID of the first attachment.
 * @property {string} secondaryAttach2 - ID of the second attachment (requires Bling Pro).
 * @property {string} secondaryCamo - ID of the camouflage.
 * @property {string} equipment - ID of the lethal equipment.
 * @property {string} specialGrenade - ID of the tactical grenade.
 * @property {string} perk1 - ID of Perk Slot 1.
 * @property {string} perk2 - ID of Perk Slot 2.
 * @property {string} perk3 - ID of Perk Slot 3.
 * @property {string} deathstreak - ID of the deathstreak perk.
 */

const STORAGE_KEY = 'mw2_class_editor_classes';

/**
 * State Store Object
 */
const store = {
  /** @type {LoadoutClass[]} */
  classes: [],
  
  /** @type {number} */
  currentClassIndex: 0,

  /**
   * Returns the current state.
   */
  getState() {
    return {
      classes: this.classes,
      currentClassIndex: this.currentClassIndex
    };
  },

  /**
   * Initializes state from localStorage or defaults.
   */
  init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === NUM_CLASSES) {
          this.classes = parsed;
          return;
        }
      } catch (e) { console.error('Failed to load classes from storage:', e); }
    }
    
    this.classes = [];
    for (let i = 0; i < NUM_CLASSES; i++) {
        this.classes.push(getDefaultClass(i));
    }
  },

  /**
   * Saves current classes to localStorage.
   */
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.classes));
      events.emit('state:saved', this.classes);
    } catch (e) { console.error('Failed to save to storage:', e); }
  },

  /**
   * Updates a specific field for the current class.
   * @param {string} field - Field name in FIELD_MAP.
   * @param {string} value - New value for the field.
   */
  updateField(field, value) {
    const c = this.classes[this.currentClassIndex];
    if (c && field in c) {
      c[field] = value;
      events.emit('state:changed', { index: this.currentClassIndex, field, value });
    }
  },

  /**
   * Switches the active class.
   * @param {number} index - Index of the class (0-14).
   */
  switchClass(index) {
    if (index >= 0 && index < NUM_CLASSES) {
      this.currentClassIndex = index;
      events.emit('state:classSwitched', index);
    }
  },

  /**
   * Resets the current class to default.
   */
  resetCurrent() {
    const idx = this.currentClassIndex;
    const savedName = this.classes[idx].name;
    this.classes[idx] = getDefaultClass(idx);
    if (savedName) this.classes[idx].name = savedName;
    this.save();
    events.emit('state:classReset', idx);
  }
};
