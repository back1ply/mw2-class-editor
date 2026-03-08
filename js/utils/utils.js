/**
 * @fileoverview General utility functions for the MW2 Class Editor.
 * Includes security sanitization and performance optimization helpers.
 */

/**
 * Basic HTML escaping to prevent XSS (Cross-Site Scripting).
 * @param {string} str - The raw string to escape.
 * @returns {string} The HTML-safe escaped string.
 */
function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Creates a debounced version of a function that delays execution until after 
 * 'wait' milliseconds have elapsed since the last time it was invoked.
 * @param {Function} fn - The function to debounce.
 * @param {number} wait - The delay in milliseconds.
 * @returns {Function} The debounced function.
 */
function debounce(fn, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Simple Event Bus for inter-component communication.
 */
const events = {
  listeners: {},
  /**
   * Subscribe to an event.
   * @param {string} event - Event name.
   * @param {Function} fn - Callback function.
   */
  on(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  },
  /**
   * Publish an event.
   * @param {string} event - Event name.
   * @param {any} data - Data to pass to listeners.
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(fn => fn(data));
    }
  }
};

/**
 * Formats MW2 color codes (^1, ^2, etc.) into colored HTML spans.
 * Automatically escapes HTML to prevent XSS.
 * @param {string} text - The raw text containing ^ color codes.
 * @returns {string} The HTML string with color spans.
 */
function formatMW2Colors(text) {
  if (!text) return '';
  const parts = text.split(/(\^[\d:])/);
  let html = '';
  let currentColor = ''; // default

  for (const part of parts) {
    const codeMatch = part.match(/^\^([\d:])$/);
    if (codeMatch) {
      const code = codeMatch[1];
      if (typeof COLOR_CODES !== 'undefined' && COLOR_CODES[code]) {
         currentColor = COLOR_CODES[code];
      }
      continue;
    }
    if (part.length > 0) {
      const safeText = escapeHTML(part);
      if (currentColor) {
        html += `<span style="color: ${currentColor}">${safeText}</span>`;
      } else {
        html += safeText;
      }
    }
  }
  return html;
}

// Allow requiring in Node.js tests without breaking browser usage
if (typeof module !== 'undefined') {
  module.exports = { escapeHTML, debounce, events, formatMW2Colors };
}
