import { render } from '../node_modules/lit-html/lit-html.js';


export default function LitHtmlShadowMixin(Base) {
  return class LitHtmlShadow extends Base {

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.setState({});
    }

    render() {
      render(this.template, this.shadowRoot);
    }

    setState(state) {
      if (this._state === undefined) {
        this._state = {};
      }
      Object.assign(this._state, state);
      this.render();
    }

    get state() {
      return this._state;
    }
  }
}
