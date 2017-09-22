import { html } from '../node_modules/lit-html/lit-html.js';
import { formatStyleProps, mergeDeep } from './helpers.js';
import LitHtmlShadowMixin from './LitHtmlShadowMixin.js';


export default class TestElement extends LitHtmlShadowMixin(HTMLElement) {

  constructor() {
    super();
    const span = this.shadowRoot.querySelector('span');
    span.addEventListener('click', event => {
      console.log('click');
    });
  }

  get defaultState() {
    return {
      punctuation: '.'
    };
  }

  get punctuation() {
    return this.state.punctuation;
  }
  set punctuation(punctuation) {
    this.setState({ punctuation });
  }

  rootProps() {
    const punctuation = this.state.punctuation || '';
    return mergeDeep(super.rootProps && super.rootProps(), {
      style: {
        'font-style': punctuation.match(/!/) ? 'italic' : 'inherit'
      }
    });
  }

  get template() {
    const rootProps = this.rootProps();
    const rootStyle = formatStyleProps(rootProps.style);
    const template = html`
      <style>
        :host {
          ${rootStyle}
        }

        span {
          cursor: pointer;
          user-select: none;
        }
      </style>
      Hello, <span>
        <slot></slot>
      </span>${this.punctuation}
    `;
    return template;
  }
}


customElements.define('test-element', TestElement);
