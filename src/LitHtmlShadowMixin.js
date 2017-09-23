import { render } from '../node_modules/lit-html/lit-html.js';


const stateKey = Symbol('state');


/**
 * Mixin for rendering a component's Shadow DOM using lit-html.
 */
export default function LitHtmlShadowMixin(Base) {
  return class LitHtmlShadow extends Base {

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this[stateKey] = {};
      this.setState(this.defaultState);
    }

    get defaultState() {
      return super.defaultState || {};
    }

    render() {
      // Invoke lit-html to render the shadow subtree.
      render(this.template, this.shadowRoot);
    }

    setState(state) {
      Object.assign(this[stateKey], state);
      this.render();
    }

    get state() {
      return this[stateKey];
    }
  }
}
