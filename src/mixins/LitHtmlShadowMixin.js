import { render } from '../../node_modules/lit-html/lit-html.js';


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
      updateProps(this, this.hostProps());
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


function updateProps(element, props) {
  Object.keys(props).forEach(key => {
    if (key !== 'style') {
      const isAttribute = key.match(/-/);
      const value = props[key];
      if (isAttribute && element.getAttribute(key) !== value) {
        // Update attribute
        element.setAttribute(key, value);
      } else if (element[key] !== value) {
        // Update property
        element[key] = value;
      }
    }
  });
}
