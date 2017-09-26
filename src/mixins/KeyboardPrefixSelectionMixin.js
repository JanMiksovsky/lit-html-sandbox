import constants from './constants.js';
// import Symbol from './Symbol.js';


// Symbols for private data members on an element.
const itemTextContentsKey = Symbol('itemTextContents');
const typedPrefixKey = Symbol('typedPrefix');
const prefixTimeoutKey = Symbol('prefixTimeout');
const settingSelectionKey = Symbol('settingSelection');


export default function KeyboardPrefixSelectionMixin(Base) {

  return class KeyboardPrefixSelection extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      resetTypedPrefix(this);
    }

    // Default implementation returns an item's `alt` attribute or its
    // `textContent`, in that order.
    getItemText(item) {
      return item.getAttribute('alt') || item.textContent;
    }

    keydown(event) {
      let handled;
      let resetPrefix = true;

      switch (event.keyCode) {
        case 8: // Backspace
          handleBackspace(this);
          handled = true;
          resetPrefix = false;
          break;

        case 27: // Escape
          handled = true;
          break;
          
        default:
          if (!event.ctrlKey && !event.metaKey && !event.altKey &&
              event.which !== 32 /* Space */) {
            handlePlainCharacter(this, String.fromCharCode(event.keyCode));
          }
          resetPrefix = false;
      }

      if (resetPrefix) {
        resetTypedPrefix(this);
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super.keydown && super.keydown(event));
    }

    /**
     * Select the first item whose text content begins with the given prefix.
     *
     * @param {string} prefix - The prefix string to search for
     * @returns {boolean}
     */
    selectItemWithTextPrefix(prefix) {
      if (super.selectItemWithTextPrefix) { super.selectItemWithTextPrefix(prefix); }
      if (prefix == null || prefix.length === 0) {
        return false;
      }
      const index = getIndexOfItemWithTextPrefix(this, prefix);
      if (index >= 0) {
        return this.updateSelectedIndex(index);
      } else {
        return false;
      }
    }

  };
}


// Return the index of the first item with the given prefix, else -1.
function getIndexOfItemWithTextPrefix(component, prefix) {
  const itemTextContents = getItemTextContents(component);
  const prefixLength = prefix.length;
  for (let i = 0; i < itemTextContents.length; i++) {
    const itemTextContent = itemTextContents[i];
    if (itemTextContent.substr(0, prefixLength) === prefix) {
      return i;
    }
  }
  return -1;
}

// Return an array of the text content (in lowercase) of all items.
// Cache these results.
function getItemTextContents(component) {
  if (!component[itemTextContentsKey]) {
    const items = component.items;
    component[itemTextContentsKey] = Array.prototype.map.call(items, item => {
      const text = component.getItemText(item);
      return text.toLowerCase();
    });
  }
  return component[itemTextContentsKey];
}

// Handle the Backspace key: remove the last character from the prefix.
function handleBackspace(element) {
  const length = element[typedPrefixKey] ? element[typedPrefixKey].length : 0;
  if (length > 0) {
    element[typedPrefixKey] = element[typedPrefixKey].substr(0, length - 1);
  }
  element.selectItemWithTextPrefix(element[typedPrefixKey]);
  setPrefixTimeout(element);
}

// Add a plain character to the prefix.
function handlePlainCharacter(element, char) {
  const prefix = element[typedPrefixKey] || '';
  element[typedPrefixKey] = prefix + char.toLowerCase();
  element.selectItemWithTextPrefix(element[typedPrefixKey]);
  setPrefixTimeout(element);
}

// Stop listening for typing.
function resetPrefixTimeout(element) {
  if (element[prefixTimeoutKey]) {
    clearTimeout(element[prefixTimeoutKey]);
    element[prefixTimeoutKey] = false;
  }
}

// Clear the prefix under construction.
function resetTypedPrefix(element) {
  element[typedPrefixKey] = '';
  resetPrefixTimeout(element);
}

// Wait for the user to stop typing.
function setPrefixTimeout(element) {
  resetPrefixTimeout(element);
  element[prefixTimeoutKey] = setTimeout(() => {
    resetTypedPrefix(element);
  }, constants.TYPING_TIMEOUT_DURATION);
}
