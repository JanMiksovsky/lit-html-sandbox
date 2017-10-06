import { html } from '../../node_modules/lit-html/lit-html.js';
import { repeat } from '../../node_modules/lit-html/lib/repeat.js';
import symbols from './symbols.js';


const initializedKey = Symbol('initialized');
const initialContentObserverKey = Symbol('initialContentObserver');
const initialContentTimeoutKey = Symbol('initialContentTimeout');


/**
 * Define a component's content as its light DOM children.
 */
export default function ChildrenContentMixin(Base) {
  return class ChildrenContent extends Base {

    appendChild(child) {
      if (this[symbols.rendering]) {
        super.appendChild(child);
      } else {
        // console.log(`appendChild ${child}`);
        const content = [...this.state.content, child];
        this.setState({ content });
      }
    }

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      // console.log(`connectedCallback: ${this.childNodes.length}`);
      if (this.state.content === null) {
        // First call to connectedCallback.
        if (this.childNodes.length === 0) {
          // The document may still be parsing.

          this[initialContentObserverKey] = new MutationObserver(() => {
            // console.log(`MutationObserver: ${this.childNodes.length}`);
            extractInitialContent(this);
          });
          this[initialContentObserverKey].observe(this, { childList: true });

          this[initialContentTimeoutKey] = setTimeout(() => {
            // console.log(`timeout: ${this.childNodes.length}`);
            extractInitialContent(this);
          });
        } else {
          // Already have children.
          extractInitialContent(this);
        }
      }
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        content: null
      });
    }

    get innerHTML() {
      if (this[symbols.rendering]) {
        return super.innerHTML;
      } else {
        const strings = this.state.content.map(o =>
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
        const content = [...template.content.childNodes];
        // console.log(`set innerHTML = ${content}`);
        this.setState({ content });
      }
    }

    renderContent() {
      return this.state.content;
      // return html`${repeat(this.state.content, item => item)}`;
    }

    get textContent() {
      if (this[symbols.rendering]) {
        return super.textContent;
      } else {
        const strings = this.state.content.map(o =>
          o instanceof Node ? o.textContent : o.toString()
        );
        return strings.join('');
      }
    }
    set textContent(textContent) {
      if (this[symbols.rendering]) {
        super.textContent = textContent;
      } else {
        const content = textContent.toString();
        // console.log(`set textContent = ${content}`);
        this.setState({ content });
      }
    }

  }
}


function extractInitialContent(component) {

  // console.log(`extractInitialContent`);

  // Stop waiting for any pending notifications.
  if (component[initialContentObserverKey]) {
    component[initialContentObserverKey].disconnect();
    component[initialContentObserverKey] = null;
  }
  if (component[initialContentTimeoutKey]) {
    clearTimeout(component[initialContentTimeoutKey]);
    component[initialContentTimeoutKey] = null;
  }

  // Extract any initial light DOM children as content.
  const content = [];
  while (component.childNodes.length > 0) {
    content.push(component.childNodes[0]);
    component.removeChild(component.childNodes[0]);
  }

  // Set the content as state, triggering a render. That will typically render
  // the content into some new position in the light DOM.
  component.setState({ content });
}
