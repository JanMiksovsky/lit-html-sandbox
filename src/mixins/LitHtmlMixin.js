import { render } from '../../node_modules/lit-html/lit-html.js';
import symbols from './symbols.js';


const initializedKey = Symbol('initialized');
const renderingKey = Symbol('renderingKey');


/**
 * Mixin for rendering a component's light DOM contents using lit-html.
 */
export default function LitHtmlMixin(Base) {
  return class LitHtml extends Base {

    appendChild(child) {
      if (this[renderingKey]) {
        super.appendChild(child);
      } else {
        console.log(`appendChild ${child}`);
        const children = [...this.state.children, child];
        this.setState({ children });
      }
    }

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      if (!this[initializedKey]) {
        // setTimeout(() => {
          this.render();
        // });
      }
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        children: []
      });
    }

    get innerHTML() {
      if (this[renderingKey]) {
        return super.innerHTML;
      } else {
        const strings = this.state.children.map(o =>
          o instanceof Element ?
            o.outerHTML :
              o instanceof Text ?
                o.textContent :
                o.toString()
        );
        return strings.join('');
      }
    }
    set innerHTML(html) {
      if (this[renderingKey]) {
        super.innerHTML = html;
      } else {
        const template = document.createElement('template');
        template.innerHTML = html;
        const children = [...template.content.childNodes];
        console.log(`set innerHTML = ${children}`);
        this.setState({ children });
      }
    }
    
    render() {
      if (super.render) { super.render(); }
      
      if (!this[initializedKey]) {
        // First call to render
        this[initializedKey] = true;
        const children = extractContent(this);
        if (children) {
          this.setState({ children });
          return;
        }
      }
      
      // Invoke lit-html to render the shadow subtree.
      this[renderingKey] = true;
      render(this.template, this);
      this[renderingKey] = false;
      
      // If we've created a new shadow, let the component do other
      // initialization based on the rendered shadow tree.
      // if (newShadow && this[symbols.shadowCreated]) {
        //   this[symbols.shadowCreated]();
        // }
    }  
  
    get textContent() {
      if (this[renderingKey]) {
        return super.textContent;
      } else {
        const strings = this.state.children.map(o =>
          o instanceof Node ? o.textContent : o.toString()
        );
        return strings.join('');
      }
    }
    set textContent(textContent) {
      if (this[renderingKey]) {
        super.textContent = textContent;
      } else {
        const children = textContent.toString();
        console.log(`set textContent = ${children}`);
        this.setState({ children });
      }
    }

  }
}


function extractContent(component) {
  let content = null;
  while (component.childNodes.length > 0) {
    if (!content) {
      content = [];
    }
    content.push(component.childNodes[0]);
    component.removeChild(component.childNodes[0]);
  }
  return content;
}
