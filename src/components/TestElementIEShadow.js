import { mergeDeep } from '../mixins/helpers.js';
import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import DefaultSlotContentMixin from '../mixins/DefaultSlotContentMixin.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import symbols from '../mixins/symbols.js';


const Base =
  AttributeMarshallingMixin(
  DefaultSlotContentMixin(
  ReactiveMixin(
    HTMLElement
  )));


/**
 * A simple web component created with a functional reactive programming (FRP)
 * style. In this approach, we track component state in a single `state` member,
 * then render that state to DOM. For that task, the component uses lit-html,
 * although other similar libraries could be used instead.
 *
 * The component itself is a trivial "Hello, world" element.
 */
export default class TestElementIEShadow extends Base {

  constructor() {
    super();
    // Sample event handler just to show we can respond to events.
    this.addEventListener('click', event => {
      this.togglePunctuation();
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      punctuation: '.'
    });
  }

  // These are properties that will be applied to the element's host.
  // Defining them this way allows other mixins to easily contribute style,
  // ARIA, and other attributes.
  hostProps() {
    const punctuation = this.state.punctuation || '';
    return mergeDeep(super.hostProps && super.hostProps(), {
      style: {
        'cursor': 'pointer',
        'font-style': punctuation.match(/!/) ? 'italic' : 'inherit',
        '-webkit-tap-highlight-color': 'transparent',
        '-ms-user-select': 'none',
        '-webkit-user-select': 'none',
        'user-select': 'none',
      }
    });
  }

  render() {
    this[symbols.rendering] = true;
    
    if (!this.shadowRoot) {
      const root = this.attachShadow({ mode: 'open' });
      root.appendChild(document.createTextNode('Hello'));
      this.$ = {};
      this.$.comma = root.appendChild(document.createTextNode(''));
      root.appendChild(document.createElement('slot'));
      this.$.punctuation = root.appendChild(document.createTextNode(''));
      this[symbols.shadowCreated]();
    }

    if (this.state.content === null) {
      return;
    }

    if (super.render) { super.render(); }
    while (this.childNodes.length > 0) {
      this.removeChild(this.childNodes[0]);
    }
    
    const hasContent = this.state.content && this.state.content.length > 0;
    this.$.comma.textContent = hasTextContent(this) ? ', ' : '';
    this.state.content.forEach(item => this.appendChild(item));
    this.$.punctuation.textContent = this.state.punctuation;

    this[symbols.rendering] = false;
  }

  // A sample property that updates component state.
  get punctuation() {
    return this.state.punctuation;
  }
  set punctuation(punctuation) {
    this.setState({ punctuation });
  }

  togglePunctuation() {
    this.punctuation = this.punctuation === '.' ?
      '!' :
      '.';
  }
}


function hasTextContent(component) {
  const content = component.state.content;
  if (!content) {
    return false;
  }
  for (let i = 0; i < content.length; i++) {
    const node = content[i];
    if (node.textContent.length > 0) {
      return true;
    }
  }
  return false;
}


customElements.define('test-element-ie-shadow', TestElementIEShadow);
