const stateKey = Symbol('state');
import { updateProps } from '../mixins/helpers.js';


/**
 * Mixin for managing a component's state.
 */
export default function ReactiveMixin(Base) {
  return class Reactive extends Base {

    constructor() {
      super();
      this[stateKey] = {};
      this.setState(this.defaultState);
    }

    get defaultState() {
      return super.defaultState || {};
    }

    render() {
      if (super.render) { super.render(); }
      if (this.hostProps) {
        const hostProps = this.hostProps();
        updateProps(this, hostProps);
      }
      if (this.componentDidUpdate) {
        Promise.resolve().then(() => {
          this.componentDidUpdate();
        });
      }
    }

    setState(state) {
      Object.assign(this[stateKey], state);
      this.render();
    }

    get state() {
      return this[stateKey];
    }
  }
}
