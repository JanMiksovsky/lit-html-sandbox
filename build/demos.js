/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _TestElement = __webpack_require__(7);

var _TestElement2 = _interopRequireDefault(_TestElement);

var _TestElement3 = __webpack_require__(12);

var _TestElement4 = _interopRequireDefault(_TestElement3);

var _TestElement5 = __webpack_require__(9);

var _TestElement6 = _interopRequireDefault(_TestElement5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["html"] = html;
/* harmony export (immutable) */ __webpack_exports__["render"] = render;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// The first argument to JS template tags retain identity across multiple
// calls to a tag for the same literal, so we can cache work done per literal
// in a Map.
const templates = new Map();
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
function html(strings, ...values) {
    let template = templates.get(strings);
    if (template === undefined) {
        template = new Template(strings);
        templates.set(strings, template);
    }
    return new TemplateResult(template, values);
}
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(template, values) {
        this.template = template;
        this.values = values;
    }
}
/* harmony export (immutable) */ __webpack_exports__["TemplateResult"] = TemplateResult;

/**
 * Renders a template to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 */
function render(result, container, partCallback = defaultPartCallback) {
    let instance = container.__templateInstance;
    // Repeat render, just call update()
    if (instance !== undefined && instance.template === result.template &&
        instance._partCallback === partCallback) {
        instance.update(result.values);
        return;
    }
    // First render, create a new TemplateInstance and append it
    instance = new TemplateInstance(result.template, partCallback);
    container.__templateInstance = instance;
    const fragment = instance._clone();
    instance.update(result.values);
    let child;
    while ((child = container.lastChild)) {
        container.removeChild(child);
    }
    container.appendChild(fragment);
}
/**
 * An expression marker with embedded unique key to avoid
 * https://github.com/PolymerLabs/lit-html/issues/62
 */
const exprMarker = `{{lit-${Math.random()}}}`;
/**
 * A placeholder for a dynamic expression in an HTML template.
 *
 * There are two built-in part types: AttributePart and NodePart. NodeParts
 * always represent a single dynamic expression, while AttributeParts may
 * represent as many expressions are contained in the attribute.
 *
 * A Template's parts are mutable, so parts can be replaced or modified
 * (possibly to implement different template semantics). The contract is that
 * parts can only be replaced, not removed, added or reordered, and parts must
 * always consume the correct number of values in their `update()` method.
 *
 * TODO(justinfagnani): That requirement is a little fragile. A
 * TemplateInstance could instead be more careful about which values it gives
 * to Part.update().
 */
class TemplatePart {
    constructor(type, index, name, rawName, strings) {
        this.type = type;
        this.index = index;
        this.name = name;
        this.rawName = rawName;
        this.strings = strings;
    }
}
/* harmony export (immutable) */ __webpack_exports__["TemplatePart"] = TemplatePart;

class Template {
    constructor(strings) {
        this.parts = [];
        this.element = document.createElement('template');
        this.element.innerHTML = strings.join(exprMarker);
        const walker = document.createTreeWalker(this.element.content, 5 /* elements & text */);
        let index = -1;
        let partIndex = 0;
        const nodesToRemove = [];
        while (walker.nextNode()) {
            index++;
            const node = walker.currentNode;
            if (node.nodeType === 1 /* ELEMENT_NODE */) {
                if (!node.hasAttributes())
                    continue;
                const attributes = node.attributes;
                for (let i = 0; i < attributes.length; i++) {
                    const attribute = attributes.item(i);
                    const attributeStrings = attribute.value.split(exprMarker);
                    if (attributeStrings.length > 1) {
                        // Get the template literal section leading up to the first
                        // expression in this attribute attribute
                        const attributeString = strings[partIndex];
                        // Trim the trailing literal value if this is an interpolation
                        const rawNameString = attributeString.substring(0, attributeString.length - attributeStrings[0].length);
                        // Find the attribute name
                        const rawName = rawNameString.match(/((?:\w|[.\-_$])+)=["']?$/)[1];
                        this.parts.push(new TemplatePart('attribute', index, attribute.name, rawName, attributeStrings));
                        node.removeAttribute(attribute.name);
                        partIndex += attributeStrings.length - 1;
                        i--;
                    }
                }
            }
            else if (node.nodeType === 3 /* TEXT_NODE */) {
                const strings = node.nodeValue.split(exprMarker);
                if (strings.length > 1) {
                    const parent = node.parentNode;
                    const lastIndex = strings.length - 1;
                    // We have a part for each match found
                    partIndex += lastIndex;
                    // We keep this current node, but reset its content to the last
                    // literal part. We insert new literal nodes before this so that the
                    // tree walker keeps its position correctly.
                    node.textContent = strings[lastIndex];
                    // Generate a new text node for each literal section
                    // These nodes are also used as the markers for node parts
                    for (let i = 0; i < lastIndex; i++) {
                        parent.insertBefore(new Text(strings[i]), node);
                        this.parts.push(new TemplatePart('node', index++));
                    }
                }
                else if (!node.nodeValue.trim()) {
                    nodesToRemove.push(node);
                    index--;
                }
            }
        }
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["Template"] = Template;

const getValue = (part, value) => {
    // `null` as the value of a Text node will render the string 'null'
    // so we convert it to undefined
    if (value != null && value.__litDirective === true) {
        value = value(part);
    }
    return value === null ? undefined : value;
};
/* harmony export (immutable) */ __webpack_exports__["getValue"] = getValue;

const directive = (f) => {
    f.__litDirective = true;
    return f;
};
/* harmony export (immutable) */ __webpack_exports__["directive"] = directive;

class AttributePart {
    constructor(instance, element, name, strings) {
        this.instance = instance;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.size = strings.length - 1;
    }
    setValue(values, startIndex) {
        const strings = this.strings;
        let text = '';
        for (let i = 0; i < strings.length; i++) {
            text += strings[i];
            if (i < strings.length - 1) {
                const v = getValue(this, values[startIndex + i]);
                if (v &&
                    (Array.isArray(v) || typeof v !== 'string' && v[Symbol.iterator])) {
                    for (const t of v) {
                        // TODO: we need to recursively call getValue into iterables...
                        text += t;
                    }
                }
                else {
                    text += v;
                }
            }
        }
        this.element.setAttribute(this.name, text);
    }
}
/* harmony export (immutable) */ __webpack_exports__["AttributePart"] = AttributePart;

class NodePart {
    constructor(instance, startNode, endNode) {
        this.instance = instance;
        this.startNode = startNode;
        this.endNode = endNode;
    }
    setValue(value) {
        value = getValue(this, value);
        if (value === null ||
            !(typeof value === 'object' || typeof value === 'function')) {
            // Handle primitive values
            // If the value didn't change, do nothing
            if (value === this._previousValue) {
                return;
            }
            this._setText(value);
        }
        else if (value instanceof TemplateResult) {
            this._setTemplateResult(value);
        }
        else if (Array.isArray(value) || value[Symbol.iterator]) {
            this._setIterable(value);
        }
        else if (value instanceof Node) {
            this._setNode(value);
        }
        else if (value.then !== undefined) {
            this._setPromise(value);
        }
        else {
            // Fallback, will render the string representation
            this._setText(value);
        }
    }
    _insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    _setNode(value) {
        this.clear();
        this._insert(value);
        this._previousValue = value;
    }
    _setText(value) {
        const node = this.startNode.nextSibling;
        if (node === this.endNode.previousSibling &&
            node.nodeType === Node.TEXT_NODE) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if _previousValue is
            // primitive?
            node.textContent = value;
        }
        else {
            this._setNode(new Text(value));
        }
        this._previousValue = value;
    }
    _setTemplateResult(value) {
        let instance;
        if (this._previousValue &&
            this._previousValue.template === value.template) {
            instance = this._previousValue;
        }
        else {
            instance =
                new TemplateInstance(value.template, this.instance._partCallback);
            this._setNode(instance._clone());
            this._previousValue = instance;
        }
        instance.update(value.values);
    }
    _setIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _previousValue is an array, then the previous render was of an
        // iterable and _previousValue will contain the NodeParts from the previous
        // render. If _previousValue is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this._previousValue)) {
            this.clear();
            this._previousValue = [];
        }
        // Lets of keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this._previousValue;
        let partIndex = 0;
        for (const item of value) {
            // Try to reuse an existing part
            let itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                // If we're creating the first item part, it's startNode should be the
                // container's startNode
                let itemStart = this.startNode;
                // If we're not creating the first part, create a new separator marker
                // node, and fix up the previous part's endNode to point to it
                if (partIndex > 0) {
                    const previousPart = itemParts[partIndex - 1];
                    itemStart = previousPart.endNode = new Text();
                    this._insert(itemStart);
                }
                itemPart = new NodePart(this.instance, itemStart, this.endNode);
                itemParts.push(itemPart);
            }
            itemPart.setValue(item);
            partIndex++;
        }
        if (partIndex === 0) {
            this.clear();
            this._previousValue = undefined;
        }
        else if (partIndex < itemParts.length) {
            const lastPart = itemParts[partIndex - 1];
            this.clear(lastPart.endNode.previousSibling);
            lastPart.endNode = this.endNode;
        }
    }
    _setPromise(value) {
        value.then((v) => {
            if (this._previousValue === value) {
                this.setValue(v);
            }
        });
        this._previousValue = value;
    }
    clear(startNode = this.startNode) {
        let node;
        while ((node = startNode.nextSibling) !== this.endNode) {
            node.parentNode.removeChild(node);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["NodePart"] = NodePart;

const defaultPartCallback = (instance, templatePart, node) => {
    if (templatePart.type === 'attribute') {
        return new AttributePart(instance, node, templatePart.name, templatePart.strings);
    }
    else if (templatePart.type === 'node') {
        return new NodePart(instance, node, node.nextSibling);
    }
    throw new Error(`Unknown part type ${templatePart.type}`);
};
/* harmony export (immutable) */ __webpack_exports__["defaultPartCallback"] = defaultPartCallback;

/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
    constructor(template, partCallback = defaultPartCallback) {
        this._parts = [];
        this.template = template;
        this._partCallback = partCallback;
    }
    update(values) {
        let valueIndex = 0;
        for (const part of this._parts) {
            if (part.size === undefined) {
                part.setValue(values[valueIndex]);
                valueIndex++;
            }
            else {
                part.setValue(values, valueIndex);
                valueIndex += part.size;
            }
        }
    }
    _clone() {
        const fragment = document.importNode(this.template.element.content, true);
        if (this.template.parts.length > 0) {
            const walker = document.createTreeWalker(fragment, 5 /* elements & text */);
            const parts = this.template.parts;
            let index = 0;
            let partIndex = 0;
            let templatePart = parts[0];
            let node = walker.nextNode();
            while (node != null && partIndex < parts.length) {
                if (index === templatePart.index) {
                    this._parts.push(this._partCallback(this, templatePart, node));
                    templatePart = parts[++partIndex];
                }
                else {
                    index++;
                    node = walker.nextNode();
                }
            }
        }
        return fragment;
    }
}
/* harmony export (immutable) */ __webpack_exports__["TemplateInstance"] = TemplateInstance;

//# sourceMappingURL=lit-html.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.formatStyleProps = formatStyleProps;
exports.isAttribute = isAttribute;
exports.mergeDeep = mergeDeep;
exports.updateProps = updateProps;
function formatStyleProps(styleProps) {
  if (!styleProps) {
    return '';
  }
  var attributes = Object.keys(styleProps).map(function (key) {
    return key + ': ' + styleProps[key];
  });
  return attributes.join(';');
}

function isAttribute(key) {
  var attributeWhiteList = ['class', 'role'];
  return key.match(/-/) || attributeWhiteList.indexOf(key) >= 0;
}

function mergeDeep() {
  var output = {};

  for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }

  sources.forEach(function (source) {
    if (source) {
      Object.keys(source).forEach(function (key) {
        var value = source[key];
        var valueIsObject = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !Array.isArray(value);
        output[key] = valueIsObject && key in output ? mergeDeep(output[key], value) : value;
      });
    }
  });
  return output;
}

function updateProps(element, props) {
  Object.keys(props).forEach(function (key) {
    var value = key === 'style' ? formatStyleProps(props[key]) : props[key];
    if (isAttribute(key) && element.getAttribute(key) !== value) {
      // Update attribute
      if (value) {
        element.setAttribute(key, value);
      } else {
        element.removeAttribute(key);
      }
    } else if (element[key] !== value) {
      // Update property
      element[key] = value;
    }
  });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// import Symbol from './Symbol.js';


/**
 * A collection of (potentially polyfilled) `Symbol` objects for standard
 * component properties and methods.
 *
 * These `Symbol` objects are used to allow mixins and a component to internally
 * communicate, without exposing these properties and methods in the component's
 * public API.
 *
 * To use these `Symbol` objects in your own component, include this module and
 * then create a property or method whose key is the desired Symbol.
 *
 *     import 'SingleSelectionMixin' from 'elix/mixins/SingleSelectionMixin';
 *     import 'symbols' from 'elix/mixins/symbols';
 *
 *     class MyElement extends SingleSelectionMixin(HTMLElement) {
 *       [symbols.itemSelected](item, selected) {
 *         // This will be invoked whenever an item is selected/deselected.
 *       }
 *     }
 *
 * To support Internet Explorer 11, which does not have support for the
 * `Symbol` class, you can use the [Symbol](Symbol) helper, or a `Symbol`
 * polyfill of your choice.
 *
 * @module symbols
 */
var symbols = {

  /**
   * Symbol for the `afterEffect` method.
   * 
   * This method is invoked after a visual effect has completed. Implement
   * this method to perform any necessary cleanup.
   * 
   * @param {string} effect - The name of the effect that has completed
   */
  afterEffect: Symbol('afterEffect'),

  /**
   * Symbol for the `applyEffect` method.
   * 
   * This method is invoked to trigger the execution of a visual effect.
   * 
   * @param {string} effect - The name of the effect to apply
   * @returns {Promise} A Promise that resolves when the effect completes
   */
  applyEffect: Symbol('applyEffect'),

  /**
   * Symbol for the `beforeEffect` method.
   * 
   * This method is invoked before a visual effect has begun. Implement this
   * method to prepare the element for the effect.
   * 
   * @param {string} effect - The name of the effect that has completed
   */
  beforeEffect: Symbol('beforeEffect'),

  /**
   * The name of the visual effect currently begin shown.
   * 
   * @returns {string}
   */
  currentEffect: Symbol('currentEffect'),

  /**
   * Symbol for the `defaults` property.
   *
   * This property can be used to set or override defaults that will be applied
   * to a new component instance. When implementing this property, take care to
   * first acquire any defaults defined by the superclass. The standard idiom is
   * as follows:
   *
   *     get [symbols.defaults]() {
   *       const defaults = super[symbols.defaults] || {};
   *       // Set or override default values here
   *       defaults.customProperty = false;
   *       return defaults;
   *     }
   *
   * @var {object} defaults
   */
  defaults: Symbol('defaults'),

  /**
   * Symbol for the `elementsWithTransitions` property.
   * 
   * A component can implement this method to indicate which element(s) have CSS
   * transitions that will be triggered if the given effect is shown.
   * 
   * @param {string} effect - The effect under consideration
   * @returns {[HTMLElement]} The elements with CSS transitions
   */
  elementsWithTransitions: Symbol('elementsWithTransitions'),

  /**
   * Symbol for the `getItemText` method.
   *
   * This method can be applied to an item to return its text.
   *
   * @function getItemText
   * @param {HTMLElement} item - the item to extract text from
   * @returns {string} the text of the item
   */
  getItemText: Symbol('getText'),

  /**
   * Symbol for the `goDown` method.
   *
   * This method is invoked when the user wants to go/navigate down.
   *
   * @function goDown
   */
  goDown: Symbol('goDown'),

  /**
   * Symbol for the `goEnd` method.
   *
   * This method is invoked when the user wants to go/navigate to the end (e.g.,
   * of a list).
   *
   * @function goEnd
   */
  goEnd: Symbol('goEnd'),

  /**
   * Symbol for the `goLeft` method.
   *
   * This method is invoked when the user wants to go/navigate left.
   *
   * @function goLeft
   */
  goLeft: Symbol('goLeft'),

  /**
   * Symbol for the `goRight` method.
   *
   * This method is invoked when the user wants to go/navigate right.
   *
   * @function goRight
   */
  goRight: Symbol('goRight'),

  /**
   * Symbol for the `goStart` method.
   *
   * This method is invoked when the user wants to go/navigate to the start
   * (e.g., of a list).
   *
   * @function goStart
   */
  goStart: Symbol('goStart'),

  /**
   * Symbol for the `goUp` method.
   *
   * This method is invoked when the user wants to go/navigate up.
   *
   * @function goUp
   */
  goUp: Symbol('goUp'),

  /**
   * Symbol for the `itemAdded` method.
   *
   * This method is invoked when a new item is added to a list.
   *
   * @function itemAdded
   * @param {HTMLElement} item - the item being selected/deselected
   */
  itemAdded: Symbol('itemAdded'),

  /**
   * Symbol for the `itemsChanged` method.
   *
   * This method is invoked when the underlying contents change. It is also
   * invoked on component initialization – since the items have "changed" from
   * being nothing.
   *
   * @function itemsChanged
   */
  itemsChanged: Symbol('itemsChanged'),

  /**
   * Symbol for the `itemSelected` method.
   *
   * This method is invoked when an item becomes selected or deselected.
   *
   * @function itemSelected
   * @param {HTMLElement} item - the item being selected/deselected
   * @param {boolean} selected - true if the item is selected, false if not
   */
  itemSelected: Symbol('itemSelected'),

  /**
   * Symbol for the `keydown` method.
   *
   * This method is invoked when an element receives a `keydown` event.
   *
   * @function keydown
   * @param {KeyboardEvent} event - the event being processed
   */
  keydown: Symbol('keydown'),

  /**
   * Symbol for the `openedChanged` method.
   * 
   * This method is invoked when the `opened` property has changed. There are
   * two advantages to using `openedChanged` rather than implementing a setter
   * for the `opened` property: 1) `openedChanged` will supply the _parsed_
   * value of the `opened` property, whereas the `opened` property might be
   * passed a string as an attribute value, and 2) `openedChanged` only executes
   * when the value of `opened` has actually changed.
   * 
   * @param {boolean} opened - The new value of the `opened` property
   */
  openedChanged: Symbol('openedChanged'),

  /**
   * Indicates the general horizontal and/or vertical orientation of the
   * component. This may affect both presentation and behavior (e.g., of
   * keyboard navigation).
   *
   * Accepted values are "horizontal", "vertical", or "both" (the default).
   *
   * @type {string}
   */
  orientation: Symbol('orientation'),

  /**
   * Symbol for the `raiseChangeEvents` property.
   *
   * This property is used by mixins to determine whether they should raise
   * property change events. The standard HTML pattern is to only raise such
   * events in response to direct user interactions. For a detailed discussion
   * of this point, see the Gold Standard checklist item for
   * [Propery Change Events](https://github.com/webcomponents/gold-standard/wiki/Property%20Change%20Events).
   *
   * The above article describes a pattern for using a flag to track whether
   * work is being performed in response to internal component activity, and
   * whether the component should therefore raise property change events.
   * This `raiseChangeEvents` symbol is a shared flag used for that purpose by
   * all Elix mixins and components. Sharing this flag ensures that internal
   * activity (e.g., a UI event listener) in one mixin can signal other mixins
   * handling affected properties to raise change events.
   *
   * All UI event listeners (and other forms of internal handlers, such as
   * timeouts and async network handlers) should set `raiseChangeEvents` to
   * `true` at the start of the event handler, then `false` at the end:
   *
   *     this.addEventListener('click', event => {
   *       this[symbols.raiseChangeEvents] = true;
   *       // Do work here, possibly setting properties, like:
   *       this.foo = 'Hello';
   *       this[symbols.raiseChangeEvents] = false;
   *     });
   *
   * Elsewhere, property setters that raise change events should only do so it
   * this property is `true`:
   *
   *     set foo(value) {
   *       // Save foo value here, do any other work.
   *       if (this[symbols.raiseChangeEvents]) {
   *         const event = new CustomEvent('foo-changed');
   *         this.dispatchEvent(event);
   *       }
   *     }
   *
   * In this way, programmatic attempts to set the `foo` property will not
   * trigger the `foo-changed` event, but UI interactions that update that
   * property will cause those events to be raised.
   *
   * @var {boolean} raiseChangeEvents
   */
  raiseChangeEvents: Symbol('raiseChangeEvents'),

  rendering: Symbol('rendering'),

  /**
   * Symbol for the `scrollTarget` property.
   *
   * This property indicates which element in a component's shadow subtree
   * should be scrolled. [SelectionInViewMixin](SelectionInViewMixin) can use
   * this property to determine which element should be scrolled to keep the
   * selected item in view.
   *
   * @var {HTMLElement} scrollTarget
   */
  scrollTarget: Symbol('scrollTarget'),

  /**
   * Symbol for the `showEffect` method.
   * 
   * This method invokes an asynchronous visual effect. It will invoke
   * the `beforeEffect`, `applyEffect`, and `afterEffect` methods in
   * turn. The first and last of those are synchronous, but `applyEffect`
   * is asynchronous.
   * 
   * @param {string} effect - The name of the effect that has completed
   */
  showEffect: Symbol('showEffect'),

  /**
   * Symbol for the `shadowCreated` method.
   *
   * This method is invoked when the component's shadow root has been attached
   * and populated. Other code can handle this method to perform initialization
   * that depends upon the existence of a populated shadow subtree.
   *
   * @function shadowCreated
   */
  shadowCreated: Symbol('shadowCreated'),

  /**
   * Symbol for the `template` method.
   *
   * This method should return a component's template.
   *
   * @param {string|object} [filler]
   * @type {string|HTMLTemplateElement}
   */
  template: Symbol('template')
};

exports.default = symbols;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = AttributeMarshallingMixin;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Memoized maps of attribute to property names and vice versa.
var attributeToPropertyNames = {};
var propertyNamesToAttributes = {};

function AttributeMarshallingMixin(Base) {
  return function (_Base) {
    _inherits(AttributeMarshalling, _Base);

    function AttributeMarshalling() {
      _classCallCheck(this, AttributeMarshalling);

      return _possibleConstructorReturn(this, (AttributeMarshalling.__proto__ || Object.getPrototypeOf(AttributeMarshalling)).apply(this, arguments));
    }

    _createClass(AttributeMarshalling, [{
      key: 'attributeChangedCallback',

      /**
       * Handle a change to the attribute with the given name.
       */
      value: function attributeChangedCallback(attributeName, oldValue, newValue) {
        if (_get(AttributeMarshalling.prototype.__proto__ || Object.getPrototypeOf(AttributeMarshalling.prototype), 'attributeChangedCallback', this)) {
          _get(AttributeMarshalling.prototype.__proto__ || Object.getPrototypeOf(AttributeMarshalling.prototype), 'attributeChangedCallback', this).call(this);
        }
        var propertyName = attributeToPropertyName(attributeName);
        // If the attribute name corresponds to a property name, set the property.
        if (propertyName in this) {
          this[propertyName] = newValue;
        }
      }
    }], [{
      key: 'observedAttributes',
      get: function get() {
        return attributesForClass(this);
      }
    }]);

    return AttributeMarshalling;
  }(Base);
}

/**
 * Return the custom attributes for the given class.
 */
function attributesForClass(classFn) {

  // We treat the HTMLElement base class as if it has no attributes, since we
  // don't want to receive attributeChangedCallback for it. We'd like to do
  // a simple check if classFn === HTMLElement, but this fails in the polyfill
  // under IE, so we compare prototypes instead.
  if (classFn.prototype === HTMLElement.prototype) {
    return [];
  }

  // Get attributes for parent class.
  var baseClass = Object.getPrototypeOf(classFn.prototype).constructor;
  // See if parent class defines observedAttributes manually.
  var baseAttributes = baseClass.observedAttributes;
  if (!baseAttributes) {
    // Calculate parent class attributes ourselves.
    baseAttributes = attributesForClass(baseClass);
  }

  // Get attributes for this class.
  var propertyNames = Object.getOwnPropertyNames(classFn.prototype);
  var setterNames = propertyNames.filter(function (propertyName) {
    return typeof Object.getOwnPropertyDescriptor(classFn.prototype, propertyName).set === 'function';
  });
  var attributes = setterNames.map(function (setterName) {
    return propertyNameToAttribute(setterName);
  });

  // Merge.
  var diff = attributes.filter(function (attribute) {
    return baseAttributes.indexOf(attribute) < 0;
  });
  return baseAttributes.concat(diff);
}

/**
 * Convert hyphenated foo-bar attribute name to camel case fooBar property name.
 */
function attributeToPropertyName(attributeName) {
  var propertyName = attributeToPropertyNames[attributeName];
  if (!propertyName) {
    // Convert and memoize.
    var hyphenRegEx = /-([a-z])/g;
    propertyName = attributeName.replace(hyphenRegEx, function (match) {
      return match[1].toUpperCase();
    });
    attributeToPropertyNames[attributeName] = propertyName;
  }
  return propertyName;
}

/**
 * Convert a camel case fooBar property name to a hyphenated foo-bar attribute.
 */
function propertyNameToAttribute(propertyName) {
  var attribute = propertyNamesToAttributes[propertyName];
  if (!attribute) {
    // Convert and memoize.
    var uppercaseRegEx = /([A-Z])/g;
    attribute = propertyName.replace(uppercaseRegEx, '-$1').toLowerCase();
  }
  return attribute;
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = LitHtmlMixin;

var _litHtml = __webpack_require__(1);

var _symbols = __webpack_require__(3);

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var renderedKey = Symbol('rendered');

/**
 * Mixin for rendering a component's light DOM contents using lit-html.
 */
function LitHtmlMixin(Base) {
  return function (_Base) {
    _inherits(LitHtml, _Base);

    function LitHtml() {
      _classCallCheck(this, LitHtml);

      return _possibleConstructorReturn(this, (LitHtml.__proto__ || Object.getPrototypeOf(LitHtml)).apply(this, arguments));
    }

    _createClass(LitHtml, [{
      key: 'connectedCallback',
      value: function connectedCallback() {
        if (_get(LitHtml.prototype.__proto__ || Object.getPrototypeOf(LitHtml.prototype), 'connectedCallback', this)) {
          _get(LitHtml.prototype.__proto__ || Object.getPrototypeOf(LitHtml.prototype), 'connectedCallback', this).call(this);
        }
        // If we haven't rendered yet, do so now.
        if (!this[renderedKey]) {
          this.render();
        }
      }
    }, {
      key: 'render',
      value: function render() {
        if (_get(LitHtml.prototype.__proto__ || Object.getPrototypeOf(LitHtml.prototype), 'render', this)) {
          _get(LitHtml.prototype.__proto__ || Object.getPrototypeOf(LitHtml.prototype), 'render', this).call(this);
        }

        if (this.state.content === null) {
          // State of content is not yet unknown; wait to render.
          console.log('waiting to render');
          return;
        }
        console.log('rendering');
        this[renderedKey] = true;

        // Invoke lit-html to render the shadow subtree.
        this[_symbols2.default.rendering] = true;
        (0, _litHtml.render)(this.template, this);
        this[_symbols2.default.rendering] = false;

        // If we've created a new shadow, let the component do other
        // initialization based on the rendered shadow tree.
        // if (newShadow && this[symbols.shadowCreated]) {
        //   this[symbols.shadowCreated]();
        // }
      }
    }]);

    return LitHtml;
  }(Base);
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = ReactiveMixin;

var _helpers = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var stateKey = Symbol('state');


/**
 * Mixin for managing a component's state.
 */
function ReactiveMixin(Base) {
  return function (_Base) {
    _inherits(Reactive, _Base);

    function Reactive() {
      _classCallCheck(this, Reactive);

      var _this = _possibleConstructorReturn(this, (Reactive.__proto__ || Object.getPrototypeOf(Reactive)).call(this));

      _this[stateKey] = {};
      _this.setState(_this.defaultState);
      return _this;
    }

    _createClass(Reactive, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        if (_get(Reactive.prototype.__proto__ || Object.getPrototypeOf(Reactive.prototype), 'render', this)) {
          _get(Reactive.prototype.__proto__ || Object.getPrototypeOf(Reactive.prototype), 'render', this).call(this);
        }
        // console.log(`ReactiveMixin: render`);
        if (this.hostProps) {
          var hostProps = this.hostProps();
          (0, _helpers.updateProps)(this, hostProps);
        }
        if (this.componentDidUpdate) {
          Promise.resolve().then(function () {
            _this2.componentDidUpdate();
          });
        }
      }
    }, {
      key: 'setState',
      value: function setState(state) {
        Object.assign(this[stateKey], state);
        if (this.parentNode) {
          this.render();
        }
      }
    }, {
      key: 'defaultState',
      get: function get() {
        return _get(Reactive.prototype.__proto__ || Object.getPrototypeOf(Reactive.prototype), 'defaultState', this) || {};
      }
    }, {
      key: 'state',
      get: function get() {
        return this[stateKey];
      }
    }]);

    return Reactive;
  }(Base);
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _templateObject = _taggedTemplateLiteral(['\n      Hello', '', '', '\n    '], ['\n      Hello', '', '', '\n    ']);

var _litHtml = __webpack_require__(1);

var _helpers = __webpack_require__(2);

var _AttributeMarshallingMixin = __webpack_require__(4);

var _AttributeMarshallingMixin2 = _interopRequireDefault(_AttributeMarshallingMixin);

var _ContentCompatMixin = __webpack_require__(13);

var _ContentCompatMixin2 = _interopRequireDefault(_ContentCompatMixin);

var _LitHtmlCompatMixin = __webpack_require__(14);

var _LitHtmlCompatMixin2 = _interopRequireDefault(_LitHtmlCompatMixin);

var _ReactiveMixin = __webpack_require__(6);

var _ReactiveMixin2 = _interopRequireDefault(_ReactiveMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Base = (0, _AttributeMarshallingMixin2.default)((0, _ContentCompatMixin2.default)((0, _LitHtmlCompatMixin2.default)((0, _ReactiveMixin2.default)(HTMLElement))));

/**
 * A simple web component created with a functional reactive programming (FRP)
 * style. In this approach, we track component state in a single `state` member,
 * then render that state to DOM. For that task, the component uses lit-html,
 * although other similar libraries could be used instead.
 *
 * The component itself is a trivial "Hello, world" element.
 */

var TestElement = function (_Base) {
  _inherits(TestElement, _Base);

  function TestElement() {
    _classCallCheck(this, TestElement);

    // Sample event handler just to show we can respond to events.
    var _this = _possibleConstructorReturn(this, (TestElement.__proto__ || Object.getPrototypeOf(TestElement)).call(this));

    _this.addEventListener('click', function (event) {
      _this.togglePunctuation();
    });
    return _this;
  }

  _createClass(TestElement, [{
    key: 'hostProps',


    // These are properties that will be applied to the element's host.
    // Defining them this way allows other mixins to easily contribute style,
    // ARIA, and other attributes.
    value: function hostProps() {
      var punctuation = this.state.punctuation || '';
      return (0, _helpers.mergeDeep)(_get(TestElement.prototype.__proto__ || Object.getPrototypeOf(TestElement.prototype), 'hostProps', this) && _get(TestElement.prototype.__proto__ || Object.getPrototypeOf(TestElement.prototype), 'hostProps', this).call(this), {
        style: {
          'cursor': 'pointer',
          'font-style': punctuation.match(/!/) ? 'italic' : null,
          '-webkit-user-select': 'none',
          'user-select': 'none'
        }
      });
    }

    // A sample property that updates component state.

  }, {
    key: 'togglePunctuation',
    value: function togglePunctuation() {
      this.punctuation = this.punctuation === '.' ? '!' : '.';
    }
  }, {
    key: 'defaultState',
    get: function get() {
      return Object.assign({}, _get(TestElement.prototype.__proto__ || Object.getPrototypeOf(TestElement.prototype), 'defaultState', this), {
        punctuation: '.'
      });
    }
  }, {
    key: 'punctuation',
    get: function get() {
      return this.state.punctuation;
    },
    set: function set(punctuation) {
      this.setState({ punctuation: punctuation });
    }

    // Define a template that will be used to populate the shadow subtree.
    // This is fairly conventional FRP stuff: map component state (`this.state`)
    // to DOM. Here we do that via lit-html. The `LitHtmlMixin` mixin
    // actually does the work of rendering the template initially, and whenever
    // the state changes.

  }, {
    key: 'template',
    get: function get() {
      var hostProps = this.hostProps();
      var rootStyle = (0, _helpers.formatStyleProps)(hostProps.style);
      var hasContent = this.state.content && this.state.content.length > 0;
      var comma = hasContent ? ', ' : '';
      var template = (0, _litHtml.html)(_templateObject, comma, this.renderContent(), this.punctuation);
      return template;
    }
  }]);

  return TestElement;
}(Base);

exports.default = TestElement;


customElements.define('test-element', TestElement);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _templateObject = _taggedTemplateLiteral(['<slot></slot>'], ['<slot></slot>']);

exports.default = DefaultSlotContentMixin;

var _litHtml = __webpack_require__(1);

var _symbols = __webpack_require__(3);

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import Symbol from './Symbol.js';


// Symbols for private data members on an element.
var slotchangeFiredKey = Symbol('slotchangeFired');

/**
 * Mixin which defines a component's `symbols.content` property as the flattened
 * set of nodes assigned to its default slot.
 *
 * This also provides notification of changes to a component's content. It
 * will invoke a `symbols.contentChanged` method when the component is first
 * instantiated, and whenever its distributed children change. This is intended
 * to satisfy the Gold Standard checklist item for monitoring
 * [Content Changes](https://github.com/webcomponents/gold-standard/wiki/Content-Changes).
 *
 * Example:
 *
 * ```
 * class CountingElement extends DefaultSlotContentMixin(HTMLElement) {
 *
 *   constructor() {
 *     super();
 *     let root = this.attachShadow({ mode: 'open' });
 *     root.innerHTML = `<slot></slot>`;
 *     thisconnectedCallback();
 *   }
 *
 *   [symbols.contentChanged]() {
 *     if (super[symbols.contentChanged]) { super[symbols.contentChanged](); }
 *     // Count the component's children, both initially and when changed.
 *     this.count = this.distributedChildren.length;
 *   }
 *
 * }
 * ```
 *
 * To use this mixin, the component should define a default (unnamed) `slot`
 * element in its shadow subtree.
 *
 * To receive `contentChanged` notification, this mixin expects a component to
 * invoke a method called `symbols.shadowCreated` after the component's shadow
 * root has been created and populated.
 *
 * Most Elix [elements](elements) use `DefaultSlotContentMixin`, including
 * [ListBox](ListBox), [Modes](Modes), and [Tabs](Tabs).
 *
 * @module DefaultSlotContentMixin
 */
function DefaultSlotContentMixin(Base) {

  // The class prototype added by the mixin.
  var DefaultSlotContent = function (_Base) {
    _inherits(DefaultSlotContent, _Base);

    function DefaultSlotContent() {
      _classCallCheck(this, DefaultSlotContent);

      return _possibleConstructorReturn(this, (DefaultSlotContent.__proto__ || Object.getPrototypeOf(DefaultSlotContent)).apply(this, arguments));
    }

    _createClass(DefaultSlotContent, [{
      key: 'connectedCallback',
      value: function connectedCallback() {
        var _this2 = this;

        if (_get(DefaultSlotContent.prototype.__proto__ || Object.getPrototypeOf(DefaultSlotContent.prototype), 'connectedCallback', this)) {
          _get(DefaultSlotContent.prototype.__proto__ || Object.getPrototypeOf(DefaultSlotContent.prototype), 'connectedCallback', this).call(this);
        }
        console.log('connectedCallback');
        setTimeout(function () {
          // Some browsers fire slotchange when the slot's initial nodes are
          // assigned; others don't. If we haven't already received a slotchange
          // event by now, then act as if we did so the component can set things
          // up based on its initial content.
          if (!_this2[slotchangeFiredKey]) {
            // Invoke contentChanged as would have happened on slotchange.
            console.log('timeout');
            _this2[slotchangeFiredKey] = true;
            assignedNodesChanged(_this2);
          }
        });
      }
    }, {
      key: 'renderContent',
      value: function renderContent() {
        return (0, _litHtml.html)(_templateObject);
      }
    }, {
      key: _symbols2.default.shadowCreated,
      value: function value() {
        var _this3 = this;

        if (_get(DefaultSlotContent.prototype.__proto__ || Object.getPrototypeOf(DefaultSlotContent.prototype), _symbols2.default.shadowCreated, this)) {
          _get(DefaultSlotContent.prototype.__proto__ || Object.getPrototypeOf(DefaultSlotContent.prototype), _symbols2.default.shadowCreated, this).call(this);
        }
        // Listen to changes on the default slot.
        var slot = defaultSlot(this);
        if (slot && this[_symbols2.default.contentChanged]) {
          slot.addEventListener('slotchange', function (event) {
            console.log('slotchange');
            _this3[slotchangeFiredKey] = true;
            assignedNodesChanged(_this3);
          });
        }
      }
    }, {
      key: 'defaultState',
      get: function get() {
        return Object.assign({}, _get(DefaultSlotContent.prototype.__proto__ || Object.getPrototypeOf(DefaultSlotContent.prototype), 'defaultState', this), {
          content: null
        });
      }
    }]);

    return DefaultSlotContent;
  }(Base);

  return DefaultSlotContent;
}

/**
 * The content of this component, defined to be the flattened set of
 * nodes assigned to its default unnamed slot.
 *
 * @type {Element[]}
 */
function assignedNodesChanged(component) {

  var slot = defaultSlot(component);
  var content = void 0;

  // As of 18 July 2017, the polyfill contains a bug
  // (https://github.com/webcomponents/shadydom/issues/165)
  // that throws an exception if assignedNodes is read during a constructor
  // Until that bug is fixed, we work around the problem by catching the
  // exception.
  try {
    content = slot ? slot.assignedNodes({ flatten: true }) : [];
  } catch (e) {
    content = [];
  }

  component.setState({ content: content });
}

function defaultSlot(element) {
  var defaultSlot = element.shadowRoot && element.shadowRoot.querySelector('slot:not([name])');
  if (element.shadowRoot && !defaultSlot) {
    console.warn('DefaultSlotContentMixin expects a component to define a shadow tree that includes a default (unnamed) slot.');
  }
  return defaultSlot;
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _templateObject = _taggedTemplateLiteral(['\n      Hello', '', '', '\n    '], ['\n      Hello', '', '', '\n    ']);

var _litHtml = __webpack_require__(1);

var _helpers = __webpack_require__(2);

var _AttributeMarshallingMixin = __webpack_require__(4);

var _AttributeMarshallingMixin2 = _interopRequireDefault(_AttributeMarshallingMixin);

var _ChildrenContentMixin = __webpack_require__(10);

var _ChildrenContentMixin2 = _interopRequireDefault(_ChildrenContentMixin);

var _LitHtmlMixin = __webpack_require__(5);

var _LitHtmlMixin2 = _interopRequireDefault(_LitHtmlMixin);

var _ReactiveMixin = __webpack_require__(6);

var _ReactiveMixin2 = _interopRequireDefault(_ReactiveMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Base = (0, _AttributeMarshallingMixin2.default)((0, _ChildrenContentMixin2.default)((0, _LitHtmlMixin2.default)((0, _ReactiveMixin2.default)(HTMLElement))));

/**
 * A simple web component created with a functional reactive programming (FRP)
 * style. In this approach, we track component state in a single `state` member,
 * then render that state to DOM. For that task, the component uses lit-html,
 * although other similar libraries could be used instead.
 *
 * The component itself is a trivial "Hello, world" element.
 */

var TestElement = function (_Base) {
  _inherits(TestElement, _Base);

  function TestElement() {
    _classCallCheck(this, TestElement);

    // Sample event handler just to show we can respond to events.
    var _this = _possibleConstructorReturn(this, (TestElement.__proto__ || Object.getPrototypeOf(TestElement)).call(this));

    _this.addEventListener('click', function (event) {
      _this.togglePunctuation();
    });
    return _this;
  }

  _createClass(TestElement, [{
    key: 'hostProps',


    // These are properties that will be applied to the element's host.
    // Defining them this way allows other mixins to easily contribute style,
    // ARIA, and other attributes.
    value: function hostProps() {
      var punctuation = this.state.punctuation || '';
      return (0, _helpers.mergeDeep)(_get(TestElement.prototype.__proto__ || Object.getPrototypeOf(TestElement.prototype), 'hostProps', this) && _get(TestElement.prototype.__proto__ || Object.getPrototypeOf(TestElement.prototype), 'hostProps', this).call(this), {
        style: {
          'cursor': 'pointer',
          'font-style': punctuation.match(/!/) ? 'italic' : null,
          '-webkit-user-select': 'none',
          'user-select': 'none'
        }
      });
    }

    // A sample property that updates component state.

  }, {
    key: 'togglePunctuation',
    value: function togglePunctuation() {
      this.punctuation = this.punctuation === '.' ? '!' : '.';
    }
  }, {
    key: 'defaultState',
    get: function get() {
      return Object.assign({}, _get(TestElement.prototype.__proto__ || Object.getPrototypeOf(TestElement.prototype), 'defaultState', this), {
        punctuation: '.'
      });
    }
  }, {
    key: 'punctuation',
    get: function get() {
      return this.state.punctuation;
    },
    set: function set(punctuation) {
      this.setState({ punctuation: punctuation });
    }

    // Define a template that will be used to populate the shadow subtree.
    // This is fairly conventional FRP stuff: map component state (`this.state`)
    // to DOM. Here we do that via lit-html. The `LitHtmlMixin` mixin
    // actually does the work of rendering the template initially, and whenever
    // the state changes.

  }, {
    key: 'template',
    get: function get() {
      var hostProps = this.hostProps();
      var rootStyle = (0, _helpers.formatStyleProps)(hostProps.style);
      var hasContent = this.state.content && this.state.content.length > 0;
      var comma = hasContent ? ', ' : '';
      var template = (0, _litHtml.html)(_templateObject, comma, this.renderContent(), this.punctuation);
      return template;
    }
  }]);

  return TestElement;
}(Base);

exports.default = TestElement;


customElements.define('test-element2', TestElement);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = ChildrenContentMixin;

var _litHtml = __webpack_require__(1);

var _symbols = __webpack_require__(3);

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var initializedKey = Symbol('initialized');
var initialContentObserverKey = Symbol('initialContentObserver');
var initialContentTimeoutKey = Symbol('initialContentTimeout');

/**
 * Define a component's content as its light DOM children.
 */
function ChildrenContentMixin(Base) {
  return function (_Base) {
    _inherits(ChildrenContent, _Base);

    function ChildrenContent() {
      _classCallCheck(this, ChildrenContent);

      return _possibleConstructorReturn(this, (ChildrenContent.__proto__ || Object.getPrototypeOf(ChildrenContent)).apply(this, arguments));
    }

    _createClass(ChildrenContent, [{
      key: 'appendChild',
      value: function appendChild(child) {
        if (this[_symbols2.default.rendering]) {
          _get(ChildrenContent.prototype.__proto__ || Object.getPrototypeOf(ChildrenContent.prototype), 'appendChild', this).call(this, child);
        } else {
          console.log('appendChild ' + child);
          var content = [].concat(_toConsumableArray(this.state.content), [child]);
          this.setState({ content: content });
        }
      }
    }, {
      key: 'connectedCallback',
      value: function connectedCallback() {
        var _this2 = this;

        if (_get(ChildrenContent.prototype.__proto__ || Object.getPrototypeOf(ChildrenContent.prototype), 'connectedCallback', this)) {
          _get(ChildrenContent.prototype.__proto__ || Object.getPrototypeOf(ChildrenContent.prototype), 'connectedCallback', this).call(this);
        }
        console.log('connectedCallback: ' + this.childNodes.length);
        if (this.state.content === null) {
          // First call to connectedCallback.
          if (this.childNodes.length === 0) {
            // The document may still be parsing.

            this[initialContentObserverKey] = new MutationObserver(function () {
              console.log('MutationObserver: ' + _this2.childNodes.length);
              extractInitialContent(_this2);
            });
            this[initialContentObserverKey].observe(this, { childList: true });

            this[initialContentTimeoutKey] = setTimeout(function () {
              console.log('timeout: ' + _this2.childNodes.length);
              extractInitialContent(_this2);
            });
          } else {
            // Already have children.
            extractInitialContent(this);
          }
        }
      }
    }, {
      key: 'renderContent',
      value: function renderContent() {
        return this.state.content;
      }
    }, {
      key: 'defaultState',
      get: function get() {
        return Object.assign({}, _get(ChildrenContent.prototype.__proto__ || Object.getPrototypeOf(ChildrenContent.prototype), 'defaultState', this), {
          content: null
        });
      }
    }, {
      key: 'innerHTML',
      get: function get() {
        if (this[_symbols2.default.rendering]) {
          return _get(ChildrenContent.prototype.__proto__ || Object.getPrototypeOf(ChildrenContent.prototype), 'innerHTML', this);
        } else {
          var strings = this.state.content.map(function (o) {
            return o instanceof Element ? o.outerHTML : o instanceof Text ? o.textContent : o.toString();
          });
          return strings.join('');
        }
      },
      set: function set(html) {
        if (this[_symbols2.default.rendering]) {
          _set(ChildrenContent.prototype.__proto__ || Object.getPrototypeOf(ChildrenContent.prototype), 'innerHTML', html, this);
        } else {
          var template = document.createElement('template');
          template.innerHTML = html;
          var content = [].concat(_toConsumableArray(template.content.childNodes));
          console.log('set innerHTML = ' + content);
          this.setState({ content: content });
        }
      }
    }, {
      key: 'textContent',
      get: function get() {
        if (this[_symbols2.default.rendering]) {
          return _get(ChildrenContent.prototype.__proto__ || Object.getPrototypeOf(ChildrenContent.prototype), 'textContent', this);
        } else {
          var strings = this.state.content.map(function (o) {
            return o instanceof Node ? o.textContent : o.toString();
          });
          return strings.join('');
        }
      },
      set: function set(textContent) {
        if (this[_symbols2.default.rendering]) {
          _set(ChildrenContent.prototype.__proto__ || Object.getPrototypeOf(ChildrenContent.prototype), 'textContent', textContent, this);
        } else {
          var content = textContent.toString();
          console.log('set textContent = ' + content);
          this.setState({ content: content });
        }
      }
    }]);

    return ChildrenContent;
  }(Base);
}

function extractInitialContent(component) {

  console.log('extractInitialContent');

  // Stop waiting for any pending notifications.
  if (component[initialContentObserverKey]) {
    component[initialContentObserverKey].disconnect();
    component[initialContentObserverKey] = null;
  }
  if (component[initialContentTimeoutKey]) {
    clearTimeout(component[initialContentTimeoutKey]);
    component[initialContentTimeoutKey] = null;
  }

  // Extract any initial light DOM children as content.
  var content = [];
  while (component.childNodes.length > 0) {
    content.push(component.childNodes[0]);
    component.removeChild(component.childNodes[0]);
  }

  // Set the content as state, triggering a render. That will typically render
  // the content into some new position in the light DOM.
  component.setState({ content: content });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = LitHtmlShadowMixin;

var _litHtml = __webpack_require__(1);

var _symbols = __webpack_require__(3);

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var renderedKey = Symbol('rendered');

/**
 * Mixin for rendering a component's Shadow DOM using lit-html.
 */
function LitHtmlShadowMixin(Base) {
  return function (_Base) {
    _inherits(LitHtmlShadow, _Base);

    function LitHtmlShadow() {
      _classCallCheck(this, LitHtmlShadow);

      return _possibleConstructorReturn(this, (LitHtmlShadow.__proto__ || Object.getPrototypeOf(LitHtmlShadow)).apply(this, arguments));
    }

    _createClass(LitHtmlShadow, [{
      key: 'connectedCallback',


      // connectedCallback() {
      //   if (super.connectedCallback) { super.connectedCallback(); }
      //   if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
      //     window.ShadyCSS.styleElement(this);
      //   }
      // }

      value: function connectedCallback() {
        if (_get(LitHtmlShadow.prototype.__proto__ || Object.getPrototypeOf(LitHtmlShadow.prototype), 'connectedCallback', this)) {
          _get(LitHtmlShadow.prototype.__proto__ || Object.getPrototypeOf(LitHtmlShadow.prototype), 'connectedCallback', this).call(this);
        }
        // If we haven't rendered yet, do so now.
        if (!this[renderedKey]) {
          this.render();
        }
      }
    }, {
      key: 'render',
      value: function render() {
        if (_get(LitHtmlShadow.prototype.__proto__ || Object.getPrototypeOf(LitHtmlShadow.prototype), 'render', this)) {
          _get(LitHtmlShadow.prototype.__proto__ || Object.getPrototypeOf(LitHtmlShadow.prototype), 'render', this).call(this);
        }

        console.log('rendering');
        this[renderedKey] = true;

        var newShadow = false;
        if (!this.shadowRoot) {
          // Initial render; create shadow.
          this.attachShadow({ mode: 'open' });
          newShadow = true;
        }

        var template = this.template;

        // if (newShadow && window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
        //   // Let the CSS polyfill do its own initialization.
        //   const tag = this.localName;
        //   // Get the actual HTMLTemplateElement.
        //   const templateElement = template.template.element;
        //   window.ShadyCSS.prepareTemplate(templateElement, tag);
        // }

        // Invoke lit-html to render the shadow subtree.
        (0, _litHtml.render)(template, this.shadowRoot);

        // If we've created a new shadow, let the component do other
        // initialization based on the rendered shadow tree.
        if (newShadow && this[_symbols2.default.shadowCreated]) {
          this[_symbols2.default.shadowCreated]();
        }
      }
    }]);

    return LitHtmlShadow;
  }(Base);
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _templateObject = _taggedTemplateLiteral(['\n      Hello', '', '', '\n    '], ['\n      Hello', '', '', '\n    ']);

var _litHtml = __webpack_require__(1);

var _helpers = __webpack_require__(2);

var _AttributeMarshallingMixin = __webpack_require__(4);

var _AttributeMarshallingMixin2 = _interopRequireDefault(_AttributeMarshallingMixin);

var _DefaultSlotContentMixin = __webpack_require__(8);

var _DefaultSlotContentMixin2 = _interopRequireDefault(_DefaultSlotContentMixin);

var _LitHtmlShadowMixin = __webpack_require__(11);

var _LitHtmlShadowMixin2 = _interopRequireDefault(_LitHtmlShadowMixin);

var _ReactiveMixin = __webpack_require__(6);

var _ReactiveMixin2 = _interopRequireDefault(_ReactiveMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Base = (0, _AttributeMarshallingMixin2.default)((0, _DefaultSlotContentMixin2.default)((0, _LitHtmlShadowMixin2.default)((0, _ReactiveMixin2.default)(HTMLElement))));

/**
 * A simple web component created with a functional reactive programming (FRP)
 * style. In this approach, we track component state in a single `state` member,
 * then render that state to DOM. For that task, the component uses lit-html,
 * although other similar libraries could be used instead.
 *
 * The component itself is a trivial "Hello, world" element.
 */

var TestElement = function (_Base) {
  _inherits(TestElement, _Base);

  function TestElement() {
    _classCallCheck(this, TestElement);

    // Sample event handler just to show we can respond to events.
    var _this = _possibleConstructorReturn(this, (TestElement.__proto__ || Object.getPrototypeOf(TestElement)).call(this));

    _this.addEventListener('click', function (event) {
      _this.togglePunctuation();
    });
    return _this;
  }

  _createClass(TestElement, [{
    key: 'hostProps',


    // These are properties that will be applied to the element's host.
    // Defining them this way allows other mixins to easily contribute style,
    // ARIA, and other attributes.
    value: function hostProps() {
      var punctuation = this.state.punctuation || '';
      return (0, _helpers.mergeDeep)(_get(TestElement.prototype.__proto__ || Object.getPrototypeOf(TestElement.prototype), 'hostProps', this) && _get(TestElement.prototype.__proto__ || Object.getPrototypeOf(TestElement.prototype), 'hostProps', this).call(this), {
        style: {
          'cursor': 'pointer',
          'font-style': punctuation.match(/!/) ? 'italic' : null,
          '-webkit-user-select': 'none',
          'user-select': 'none'
        }
      });
    }

    // A sample property that updates component state.

  }, {
    key: 'togglePunctuation',
    value: function togglePunctuation() {
      this.punctuation = this.punctuation === '.' ? '!' : '.';
    }
  }, {
    key: 'defaultState',
    get: function get() {
      return Object.assign({}, _get(TestElement.prototype.__proto__ || Object.getPrototypeOf(TestElement.prototype), 'defaultState', this), {
        punctuation: '.'
      });
    }
  }, {
    key: 'punctuation',
    get: function get() {
      return this.state.punctuation;
    },
    set: function set(punctuation) {
      this.setState({ punctuation: punctuation });
    }

    // Define a template that will be used to populate the shadow subtree.
    // This is fairly conventional FRP stuff: map component state (`this.state`)
    // to DOM. Here we do that via lit-html. The `LitHtmlMixin` mixin
    // actually does the work of rendering the template initially, and whenever
    // the state changes.

  }, {
    key: 'template',
    get: function get() {
      var hostProps = this.hostProps();
      var rootStyle = (0, _helpers.formatStyleProps)(hostProps.style);
      var hasContent = this.state.content && this.state.content.length > 0;
      var comma = hasContent ? ', ' : '';
      var template = (0, _litHtml.html)(_templateObject, comma, this.renderContent(), this.punctuation);
      return template;
    }
  }]);

  return TestElement;
}(Base);

exports.default = TestElement;


customElements.define('test-element1', TestElement);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ContentCompatMixin;

var _ChildrenContentMixin = __webpack_require__(10);

var _ChildrenContentMixin2 = _interopRequireDefault(_ChildrenContentMixin);

var _DefaultSlotContentMixin = __webpack_require__(8);

var _DefaultSlotContentMixin2 = _interopRequireDefault(_DefaultSlotContentMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ContentCompatMixin(Base) {
  var nativeShadow = 'shadowRoot' in Element.prototype;
  var ContentMixin = nativeShadow ? _DefaultSlotContentMixin2.default : _ChildrenContentMixin2.default;
  return ContentMixin(Base);
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = LitHtmlCompatMixin;

var _LitHtmlMixin = __webpack_require__(5);

var _LitHtmlMixin2 = _interopRequireDefault(_LitHtmlMixin);

var _LitHtmlShadowMixin = __webpack_require__(11);

var _LitHtmlShadowMixin2 = _interopRequireDefault(_LitHtmlShadowMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LitHtmlCompatMixin(Base) {
  var nativeShadow = 'shadowRoot' in Element.prototype;
  var Mixin = nativeShadow ? _LitHtmlShadowMixin2.default : _LitHtmlMixin2.default;
  return Mixin(Base);
}

/***/ })
/******/ ]);
//# sourceMappingURL=demos.map