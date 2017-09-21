import { html } from '../node_modules/lit-html/lit-html.js';
import LitHtmlShadowMixin from './LitHtmlShadowMixin.js';


export default class TestElement extends LitHtmlShadowMixin(HTMLElement) {

  constructor() {
    super();
    this.setState({
      punctuation: '.'
    });
  }

  get punctuation() {
    return this.state.punctuation;
  }
  set punctuation(punctuation) {
    this.setState({ punctuation });
  }

  get template() {
    const punctuation = this.state.punctuation || '';
    const template = html`
      <style>
        :host {
          font-style: ${punctuation.match(/\!/) ? 'italic' : 'normal'};
        }
      </style>
      Hello, <slot></slot>${punctuation}
    `;
    return template;
  }
}


customElements.define('test-element', TestElement);
