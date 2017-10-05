import { render } from '../../node_modules/lit-html/lit-html.js';
import symbols from './symbols.js';


const renderedKey = Symbol('initialized');


/**
 * Mixin for rendering a component's light DOM contents using lit-html.
 */
export default function LitHtmlMixin(Base) {
  return class LitHtml extends Base {

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      // If we haven't rendered yet, do so now.
      if (!this[renderedKey]) {
        this.render();
      }
    }
    
    render() {
      if (super.render) { super.render(); }
      
      if (!this[renderedKey]) {
        if (this.state.content === null) {
          // State of content is not yet unknown; wait to render.
          console.log(`waiting to render`);
          return;
        }
      }
      console.log(`rendering`);
      this[renderedKey] = true;
      
      // Invoke lit-html to render the shadow subtree.
      this[symbols.rendering] = true;
      render(this.template, this);
      this[symbols.rendering] = false;
      
      // If we've created a new shadow, let the component do other
      // initialization based on the rendered shadow tree.
      // if (newShadow && this[symbols.shadowCreated]) {
      //   this[symbols.shadowCreated]();
      // }
    }  

  }
}
