import { render } from '../../node_modules/lit-html/lit-html.js';
import symbols from './symbols.js';


/**
 * Mixin for rendering a component's Shadow DOM using lit-html.
 */
export default function LitHtmlShadowMixin(Base) {
  return class LitHtmlShadow extends Base {
    render() {
      if (super.render) { super.render(); }
      if (!this.shadowRoot) {
        // Initial render; create shadow.
        this.attachShadow({ mode: 'open' });
      }
      // Invoke lit-html to render the shadow subtree.
      render(this.template, this.shadowRoot);
    }
  }
}
