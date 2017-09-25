import { mergeDeep } from '../mixins/helpers.js';
import symbols from './symbols.js';


export default function KeyboardMixin(Base) {
  return class Keyboard extends Base {

    constructor() {
      super();
      this.addEventListener('keydown', event => {
        // this[symbols.raiseChangeEvents] = true;
        const handled = this[symbols.keydown](event);
        if (handled) {
          event.preventDefault();
          event.stopPropagation();
        }
        // this[symbols.raiseChangeEvents] = false;
      });
    }

    get defaultState() {
      return mergeDeep(super.defaultState, {
        tabIndex: 0
      });
    }

    [symbols.keydown](event) {
      if (super[symbols.keydown]) { return super[symbols.keydown](event); }
      return false;
    }

    hostProps() {
      const base = super.hostProps ? super.hostProps() : {};
      return mergeDeep(super.hostProps, {
        tabIndex: this.state.tabIndex
      });
    }
    
  };
}
