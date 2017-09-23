import { html } from '../node_modules/lit-html/lit-html.js';
import { formatStyleProps, mergeDeep } from './helpers.js';
import AttributeMarshallingMixin from './AttributeMarshallingMixin.js';
import LitHtmlShadowMixin from './LitHtmlShadowMixin.js';


const Base =
  AttributeMarshallingMixin(
  LitHtmlShadowMixin(
    HTMLElement
  ));


/**
 * A silly little "Hello, world" element with a configurable `punctuation` property.
 * 
 * This uses a functional reactive style that maps state to DOM. For this
 * purpose, the component uses lit-html, although other similar libraries could
 * be used instead.
 */
export default class TestElement extends Base {

  constructor() {
    super();
    // Silly event handler just to show we can respond to events.
    this.addEventListener('click', event => {
      this.togglePunctuation();
    });
  }

  get defaultState() {
    return {
      punctuation: '.'
    };
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
        'user-select': 'none'
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
  // to DOM. Here we do that via lit-html. The `LitHtmlShadowMixin` mixin
  // actually does the work of rendering the template initially, and whenever
  // the state changes.
  get template() {
    const hostProps = this.hostProps();
    const rootStyle = formatStyleProps(hostProps.style);
    const template = html`
      <style>
        :host {
          ${rootStyle}
        }
      </style>
      Hello, <slot></slot>${this.punctuation}
    `;
    return template;
  }

  togglePunctuation() {
    this.punctuation = this.punctuation === '.' ?
      '!' :
      '.';
  }
}


customElements.define('test-element', TestElement);
