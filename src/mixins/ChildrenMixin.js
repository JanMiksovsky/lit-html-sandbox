import { render } from '../../node_modules/lit-html/lit-html.js';
import symbols from './symbols.js';


const initializedKey = Symbol('initialized');
const initialContentObserverKey = Symbol('initialContentObserver');
const initialContentTimeoutKey = Symbol('initialContentTimeout');


/**
 * Mixin for rendering a component's light DOM contents using lit-html.
 */
export default function ChildrenMixin(Base) {
  return class Children extends Base {

    appendChild(child) {
      if (this[symbols.rendering]) {
        super.appendChild(child);
      } else {
        console.log(`appendChild ${child}`);
        const children = [...this.state.children, child];
        this.setState({ children });
      }
    }

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      console.log(`connectedCallback: ${this.childNodes.length}`);
      if (this.state.children === null) {
        // First call to connectedCallback.
        if (this.childNodes.length === 0) {
          // The document may still be parsing.

          this[initialContentObserverKey] = new MutationObserver(() => {
            console.log(`MutationObserver: ${this.childNodes.length}`);
            handleInitialChildren(this);
          });
          this[initialContentObserverKey].observe(this, { childList: true });

          this[initialContentTimeoutKey] = setTimeout(() => {
            console.log(`timeout: ${this.childNodes.length}`);
            handleInitialChildren(this);
          });
        } else {
          // Already have children.
          handleInitialChildren(this);
        }
      }
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        children: null
      });
    }

    get innerHTML() {
      if (this[symbols.rendering]) {
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
      if (this[symbols.rendering]) {
        super.innerHTML = html;
      } else {
        const template = document.createElement('template');
        template.innerHTML = html;
        const children = [...template.content.childNodes];
        console.log(`set innerHTML = ${children}`);
        this.setState({ children });
      }
    }

    get textContent() {
      if (this[symbols.rendering]) {
        return super.textContent;
      } else {
        const strings = this.state.children.map(o =>
          o instanceof Node ? o.textContent : o.toString()
        );
        return strings.join('');
      }
    }
    set textContent(textContent) {
      if (this[symbols.rendering]) {
        super.textContent = textContent;
      } else {
        const children = textContent.toString();
        console.log(`set textContent = ${children}`);
        this.setState({ children });
      }
    }

  }
}


function extractChildren(component) {
  const content = [];
  while (component.childNodes.length > 0) {
    content.push(component.childNodes[0]);
    component.removeChild(component.childNodes[0]);
  }
  return content;
}


function handleInitialChildren(component) {
  console.log(`initialize`);
  if (component[initialContentObserverKey]) {
    component[initialContentObserverKey].disconnect();
    component[initialContentObserverKey] = null;
  }
  if (component[initialContentTimeoutKey]) {
    clearTimeout(component[initialContentTimeoutKey]);
    component[initialContentTimeoutKey] = null;
  }
  const children = extractChildren(component);
  component.setState({ children });
}
