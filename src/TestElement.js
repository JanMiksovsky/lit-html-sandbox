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

  rootProps() {
    const base = super.rootProps ? super.rootProps() : {};
    const punctuation = this.state.punctuation || '';
    const style = Object.assign({}, base.style, {
      'font-style': punctuation.match(/!/) ? 'italic' : 'inherit'
    });
    return Object.assign({}, base, { style });
  }

  get template() {
    const rootProps = this.rootProps();
    const rootStyle = formatStyle(rootProps.style);
    const template = html`
      <style>
        :host {
          ${rootStyle}
        }
      </style>
      Hello, <slot></slot>${this.punctuation}
    `;
    return template;
  }
}


function formatStyle(styleProps) {
  const attributes = Object.keys(styleProps).map(key => `${key}: ${styleProps[key]}`);
  return attributes.join(';');
}


customElements.define('test-element', TestElement);
