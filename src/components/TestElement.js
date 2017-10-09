import { html } from '../../node_modules/lit-html/lit-html.js';
import { formatStyleProps, mergeDeep } from '../mixins/helpers.js';
import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import ContentCompatMixin from '../mixins/ContentCompatMixin.js';
import LitHtmlCompatMixin from '../mixins/LitHtmlCompatMixin.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import symbols from '../mixins/symbols.js';


const Base =
  AttributeMarshallingMixin(
  ContentCompatMixin(
  LitHtmlCompatMixin(
  ReactiveMixin(
    HTMLElement
  ))));


/**
 * A simple web component created with a functional reactive programming (FRP)
 * style. In this approach, we track component state in a single `state` member,
 * then render that state to DOM. For that task, the component uses lit-html,
 * although other similar libraries could be used instead.
 *
 * The component itself is a trivial "Hello, world" element.
 */
export default class TestElement extends Base {

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

  // A sample property that updates component state.
  get punctuation() {
    return this.state.punctuation;
  }
  set punctuation(punctuation) {
    this.setState({ punctuation });
  }

  // Define a template that will be used to populate the shadow subtree.
  // This is fairly conventional FRP stuff: map component state (`this.state`)
  // to DOM. Here we do that via lit-html. The `LitHtmlMixin` mixin
  // actually does the work of rendering the template initially, and whenever
  // the state changes.
  get template() {
    const comma = hasTextContent(this) ? ', ' : '';
    const template = html`
      Hello${comma}${this.renderContent()}${this.punctuation}
    `;
    return template;
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


customElements.define('test-element', TestElement);
