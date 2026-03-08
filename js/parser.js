// =====================================================
//  Console Log Parser — dumpPlayerData output
//  Parses the tree-structured text from console_mp.log
// =====================================================

/**
 * Parse dumpPlayerData output and extract customClasses data.
 *
 * The format is a tree structure like:
 *   customClasses
 *     [0]
 *       name            = "Class Name"
 *       perks
 *         [0]           = frag_grenade_mp
 *         ...
 *       weaponSetups
 *         [0]
 *           weapon      = m4
 *           attachment
 *             [0]       = none
 *             [1]       = none
 *           camo        = none
 *         [1]
 *           ...
 *       specialGrenade  = concussion_grenade
 *
 * @param {string} rawText - Raw console_mp.log contents
 * @returns {{ classes: Array, count: number, errors: string[] }}
 */
function parseConsoleLog(rawText) {
  const errors = [];
  const result = [];

  // Find the customClasses section(s)
  const lines = rawText.split(/\r?\n/);

  // If the dump contains the tree structure, prioritize it over historical CFG commands.
  const hasTree = lines.some(l => l.trim() === 'customClasses');
  if (!hasTree) {
    const isCfg = lines.some(l => l.includes('setPlayerData customClasses'));
    if (isCfg) {
      return parseCfgLines(lines);
    }
  }

  // Otherwise, proceed with state machine parsing
  // We ignore indentation entirely and rely on keyword context and brackets.
  
  let inCustomClasses = false;
  let currentClassIdx = -1;
  let expectedClassIndent = -1;
  let currentSection = ''; // 'weaponSetups', 'perks', 'attachment', etc
  let currentWeaponIdx = -1;
  let currentAttachIdx = -1;
  
  const classMap = {};

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Strip leading console timestamps like "[  18215383]"
    line = line.replace(/^\[\s*\d+\s*\]/, '');
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;

    // Detect "customClasses" header
    if (trimmed === 'customClasses') {
      inCustomClasses = true;
      currentClassIdx = -1;
      continue;
    }

    if (!inCustomClasses) continue;

    // Detect array brackets [N]
    const bracketMatch = trimmed.match(/^\[(\d+)\]\s*=?\s*(.*)$/);
    if (bracketMatch) {
        const idx = parseInt(bracketMatch[1], 10);
        const inlineValue = bracketMatch[2].trim().replace(/^"|"$/g, '');
        
        // We need an unambiguous way to detect when `[N]` is a root class start vs a weaponSetup start.
        // In the MW2 console dump, root classes `[0]` through `[14]` are indented exactly 6 spaces 
        // relative to the start of the `customClasses` header. (Actually, counting spaces is what
        // we wanted to avoid, but we can just use the relative indent of the very first `[N]` we see).
        
        const lineIndent = line.search(/\S/);
        
        if (!trimmed.includes('=')) {
            // First ever bracket under customClasses is guaranteed to be [0] of the root class index
            if (expectedClassIndent === -1 && currentSection === '') {
                 expectedClassIndent = lineIndent;
            }

            if (lineIndent === expectedClassIndent) {
                 // This is definitively a root class index
                 currentClassIdx = idx;
                 currentSection = '';
                 currentWeaponIdx = -1;
                 currentAttachIdx = -1;
                 if (!classMap[currentClassIdx]) {
                     classMap[currentClassIdx] = getDefaultClass(currentClassIdx);
                 }
                 continue;
            }
        }

        if (currentSection === 'weaponSetups' && !trimmed.includes('=')) {
            currentWeaponIdx = idx;
        } else if (currentSection === 'attachment') {
            currentAttachIdx = idx;
            if (inlineValue) {
               // Fast assignment: attachment [0] = silencer
               const classData = classMap[currentClassIdx];
               if (classData && currentWeaponIdx === 0) {
                   if (currentAttachIdx === 0) classData.primaryAttach1 = inlineValue;
                   if (currentAttachIdx === 1) classData.primaryAttach2 = inlineValue;
               } else if (classData && currentWeaponIdx === 1) {
                   if (currentAttachIdx === 0) classData.secondaryAttach1 = inlineValue;
                   if (currentAttachIdx === 1) classData.secondaryAttach2 = inlineValue;
               }
            }
        } else if (currentSection === 'perks') {
            if (inlineValue) {
               // Fast assignment: perks [0] = frag_grenade_mp
               const classData = classMap[currentClassIdx];
               if (classData) {
                   if (idx === 0) classData.equipment = inlineValue;
                   if (idx === 1) classData.perk1 = inlineValue;
                   if (idx === 2) classData.perk2 = inlineValue;
                   if (idx === 3) classData.perk3 = inlineValue;
                   if (idx === 4) classData.deathstreak = inlineValue;
               }
            }
        }
        continue;
    }

    // If we have a class context, watch for sections and assignments
    if (currentClassIdx >= 0) {
        const classData = classMap[currentClassIdx];
        
        // Key-Value Assignments
        const kvMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
        if (kvMatch) {
            const key = kvMatch[1];
            const val = kvMatch[2].trim().replace(/^"|"$/g, '');
            
            if (currentSection === '') {
                // Root class properties
                if (key === 'name') classData.name = val;
                if (key === 'specialGrenade') classData.specialGrenade = val;
            } else if (currentSection === 'weaponSetups' && currentWeaponIdx >= 0) {
                // `weapon` and `camo` can appear plainly.
                if (currentWeaponIdx === 0) {
                    if (key === 'weapon') classData.primaryWeapon = val;
                    if (key === 'camo') classData.primaryCamo = val;
                } else if (currentWeaponIdx === 1) {
                    if (key === 'weapon') classData.secondaryWeapon = val;
                    if (key === 'camo') classData.secondaryCamo = val;
                }
            }
            continue;
        }

        // Section Headers (objects without an equals sign)
        const headerMatch = trimmed.match(/^(\w+)\s*$/);
        if (headerMatch) {
            const secName = headerMatch[1];
            // Known schema sections in MW2
            if (secName === 'weaponSetups') {
                currentSection = 'weaponSetups';
                currentWeaponIdx = -1;
                currentAttachIdx = -1;
            } else if (secName === 'perks') {
                currentSection = 'perks';
            } else if (secName === 'attachment') {
                currentSection = 'attachment';
                currentAttachIdx = -1;
            } 
        }
    }
  }

  // Populate numeric result array
  for (let idx = 0; idx < NUM_CLASSES; idx++) {
      result.push(classMap[idx] || getDefaultClass(idx));
  }

  return {
    classes: result,
    count: Object.keys(classMap).length,
    errors
  };
}

/**
 * Parses raw .cfg files that contain setPlayerData customClasses commands.
 */
function parseCfgLines(lines) {
  const errors = [];
  const classMap = {};

  for (let line of lines) {
    line = line.trim();
    if (!line.startsWith('setPlayerData customClasses')) continue;

    const parts = line.split(' ');
    if (parts.length < 5) continue;

    const idx = parseInt(parts[2], 10);
    if (isNaN(idx) || idx < 0 || idx >= NUM_CLASSES) continue;

    if (!classMap[idx]) {
      classMap[idx] = getDefaultClass(idx);
    }
    const classData = classMap[idx];

    const field = parts[3];

    if (field === 'name') {
       const nameMatch = line.match(/name\s+"?(.*?)"?$/);
       if (nameMatch) classData.name = nameMatch[1];
    } else if (field === 'weaponSetups') {
       const wSet = parts[4];
       const prop = parts[5];
       
       if (wSet === '0') {
          if (prop === 'weapon') classData.primaryWeapon = parts[6];
          else if (prop === 'camo') classData.primaryCamo = parts[6];
          else if (prop === 'attachment') {
             const attIdx = parts[6];
             const attVal = parts[7];
             if (attIdx === '0') classData.primaryAttach1 = attVal;
             if (attIdx === '1') classData.primaryAttach2 = attVal;
          }
       } else if (wSet === '1') {
          if (prop === 'weapon') classData.secondaryWeapon = parts[6];
          else if (prop === 'camo') classData.secondaryCamo = parts[6];
          else if (prop === 'attachment') {
             const attIdx = parts[6];
             const attVal = parts[7];
             if (attIdx === '0') classData.secondaryAttach1 = attVal;
             if (attIdx === '1') classData.secondaryAttach2 = attVal;
          }
       }
    } else if (field === 'perks') {
       const pIdx = parts[4];
       const pVal = parts[5];
       if (pIdx === '0') classData.equipment = pVal;
       if (pIdx === '1') classData.perk1 = pVal;
       if (pIdx === '2') classData.perk2 = pVal;
       if (pIdx === '3') classData.perk3 = pVal;
       if (pIdx === '4') classData.deathstreak = pVal;
    } else if (field === 'specialGrenade') {
       classData.specialGrenade = parts[4];
    }
  }

  const result = [];
  for (let i = 0; i < NUM_CLASSES; i++) {
    result.push(classMap[i] || getDefaultClass(i));
  }

  return {
    classes: result,
    count: Object.keys(classMap).length,
    errors
  };
}
