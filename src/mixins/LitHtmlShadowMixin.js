import { render } from '../../node_modules/lit-html/lit-html.js';
import symbols from './symbols.js';


/**
 * Mixin for rendering a component's Shadow DOM using lit-html.
 */
export default function LitHtmlShadowMixin(Base) {
  return class LitHtmlShadow extends Base {
    render() {
      if (super.render) { super.render(); }
      // Invoke lit-html to render the shadow subtree.
      let newShadow = false;
      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' });
        newShadow = true;
      }
      render(this.template, this.shadowRoot);
      if (newShadow && this[symbols.shadowCreated]) {
        this[symbols.shadowCreated]();
      }
    }
  }
}
