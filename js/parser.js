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

  // We need to find lines that match the customClasses tree structure.
  // The dump can contain many other sections; we only care about customClasses.

  // Strategy: find each customClasses[N] block and parse its contents
  // Look for patterns like:
  //   [0]  or  [1]  etc. under "customClasses"

  let inCustomClasses = false;
  let customClassesIndent = -1;
  let currentClassIdx = -1;
  let classBlocks = {}; // idx -> array of lines

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Strip leading console timestamps like "[  18215383]" (keep trailing spaces for indentation)
    line = line.replace(/^\[\s*\d+\s*\]/, '');

    
    const trimmed = line.trim();

    // Detect "customClasses" header
    if (trimmed === 'customClasses') {
      inCustomClasses = true;
      // Measure indent of "customClasses" keyword
      customClassesIndent = line.indexOf('customClasses');
      currentClassIdx = -1;
      continue;
    }

    if (!inCustomClasses) continue;

    // If we hit a line at the same or less indent as "customClasses" that isn't
    // part of the tree, we've left the section
    if (trimmed.length > 0 && !trimmed.startsWith('[') && !trimmed.includes('=')) {
      const lineIndent = line.search(/\S/);
      if (lineIndent >= 0 && lineIndent <= customClassesIndent) {
        inCustomClasses = false;
        continue;
      }
    }

    // Detect [N] at the first child level (class index)
    const classMatch = trimmed.match(/^\[(\d+)\]\s*$/);
    if (classMatch) {
      const lineIndent = line.search(/\S/);
      // This should be one level deeper than customClasses
      if (lineIndent > customClassesIndent) {
        currentClassIdx = parseInt(classMatch[1], 10);
        if (!classBlocks[currentClassIdx]) {
          classBlocks[currentClassIdx] = [];
        }
        continue;
      }
    }

    // Accumulate lines for the current class block
    if (currentClassIdx >= 0 && currentClassIdx < NUM_CLASSES) {
      classBlocks[currentClassIdx].push(line);
    }
  }

  // Now parse each class block
  for (let idx = 0; idx < NUM_CLASSES; idx++) {
    const classData = getDefaultClass(idx);
    const blockLines = classBlocks[idx];

    if (!blockLines || blockLines.length === 0) {
      result.push(classData);
      continue;
    }

    try {
      const parsed = parseClassBlock(blockLines);

      // Map parsed data to our class structure



      if (parsed.name !== undefined) {
        // Strip surrounding quotes if present
        classData.name = parsed.name.replace(/^"|"$/g, '');
      }

      // Weapon setups
      if (parsed.weaponSetups) {
        // Handle both collapsed (weaponSetups.weapon) and nested (weaponSetups['0'].weapon) structures
        const ws0 = parsed.weaponSetups['0'] || (parsed.weaponSetups.weapon ? parsed.weaponSetups : null);
        if (ws0) {
          if (ws0.weapon) classData.primaryWeapon = ws0.weapon;
          if (ws0.attachment) {
            const att = ws0.attachment;
            if (att['0']) classData.primaryAttach1 = att['0'];
            if (att['1']) classData.primaryAttach2 = att['1'];
          }
          if (ws0.camo) classData.primaryCamo = ws0.camo;
        }
        
        const ws1 = parsed.weaponSetups['1'];
        if (ws1) {
          if (ws1.weapon) classData.secondaryWeapon = ws1.weapon;
          if (ws1.attachment) {
            const att = ws1.attachment;
            if (att['0']) classData.secondaryAttach1 = att['0'];
            if (att['1']) classData.secondaryAttach2 = att['1'];
          }
          if (ws1.camo) classData.secondaryCamo = ws1.camo;
        }
      }



      // Perks (overloaded array)
      if (parsed.perks) {
        if (parsed.perks['0']) classData.equipment = parsed.perks['0'];
        if (parsed.perks['1']) classData.perk1 = parsed.perks['1'];
        if (parsed.perks['2']) classData.perk2 = parsed.perks['2'];
        if (parsed.perks['3']) classData.perk3 = parsed.perks['3'];
        if (parsed.perks['4']) classData.deathstreak = parsed.perks['4'];
      }

      // Special grenade (separate field)
      if (parsed.specialGrenade) {
        classData.specialGrenade = parsed.specialGrenade;
      }
    } catch (e) {
      errors.push(`Error parsing class ${idx}: ${e.message}`);
    }

    result.push(classData);
  }

  return {
    classes: result,
    count: Object.keys(classBlocks).length,
    errors
  };
}

/**
 * Parse a block of lines for a single class into a nested object.
 * Handles the indented tree format with [N] array indices and key = value pairs.
 */
function parseClassBlock(lines) {
  const obj = {};

  // Track the current path via indentation
  // Each line is either:
  //   key = value            (flat assignment)
  //   key                    (object start, like "perks" or "weaponSetups")
  //   [N] = value            (array element assignment)
  //   [N]                    (array element start, sub-object)

  const stack = [{ indent: -1, obj: obj }];

  for (const line of lines) {
    if (line.trim().length === 0) continue;

    const indent = line.search(/\S/);
    const trimmed = line.trim();

    // Pop stack to find parent
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].obj;

    // Case 1: [N] = value  (array element with direct value)
    const arrValMatch = trimmed.match(/^\[(\d+)\]\s*=\s*(.+)$/);
    if (arrValMatch) {
      const idx = arrValMatch[1];
      const val = arrValMatch[2].trim();
      parent[idx] = val;
      continue;
    }

    // Case 2: [N]  (array element start — sub-object)
    const arrObjMatch = trimmed.match(/^\[(\d+)\]\s*$/);
    if (arrObjMatch) {
      const idx = arrObjMatch[1];
      if (!parent[idx]) parent[idx] = {};
      stack.push({ indent, obj: parent[idx] });
      continue;
    }

    // Case 3: key = value  (flat assignment)
    const kvMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      const val = kvMatch[2].trim();
      parent[key] = val;
      continue;
    }

    // Case 4: key  (sub-object start, like "perks" or "weaponSetups" or "attachment")
    const keyMatch = trimmed.match(/^(\w+)\s*$/);
    if (keyMatch) {
      const key = keyMatch[1];
      if (!parent[key]) parent[key] = {};
      stack.push({ indent, obj: parent[key] });
      continue;
    }
  }

  return obj;
}
