import { render } from '../node_modules/lit-html/lit-html.js';


export default function LitHtmlShadowMixin(Base) {
  return class LitHtmlShadow extends Base {

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._state = {};
      this.setState(this.defaultState);
    }

    get defaultState() {
      return super.defaultState || {};
    }

    render() {
      render(this.template, this.shadowRoot);
    }

    setState(state) {
      Object.assign(this._state, state);
      this.render();
    }

    get state() {
      return this._state;
    }
  }
}
