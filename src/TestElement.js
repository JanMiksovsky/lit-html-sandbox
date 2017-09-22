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
    const punctuation = this.state.punctuation || '';
    return mergeDeep(super.rootProps && super.rootProps(), {
      style: {
        'font-style': punctuation.match(/!/) ? 'italic' : 'inherit'
      }
    });
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
  if (!styleProps) {
    return '';
  }
  const attributes = Object.keys(styleProps).map(key => `${key}: ${styleProps[key]}`);
  return attributes.join(';');
}

function mergeDeep(target, source) {
  const output = Object.assign({}, target);
  Object.keys(source).forEach(key => {
    const value = source[key];
    const valueIsObject = typeof value === 'object' && !Array.isArray(value);
    output[key] = valueIsObject && key in output ?
      mergeDeep(output[key], value) :
      value;
  });
  return output;
}


customElements.define('test-element', TestElement);
