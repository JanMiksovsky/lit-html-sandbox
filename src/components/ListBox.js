import { existingStyleProps, formatStyleProps, mergeDeep } from '../mixins/helpers.js';
import { html } from '../../node_modules/lit-html/lit-html.js';
import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import ClickSelectionMixin from '../mixins/ClickSelectionMixin.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import ContentCompatMixin from '../mixins/ContentCompatMixin.js';
import DirectionSelectionMixin from '../mixins/DirectionSelectionMixin.js';
import KeyboardDirectionMixin from '../mixins/KeyboardDirectionMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import KeyboardPagedSelectionMixin from '../mixins/KeyboardPagedSelectionMixin.js';
import KeyboardPrefixSelectionMixin from '../mixins/KeyboardPrefixSelectionMixin.js';
import LitHtmlCompatMixin from '../mixins/LitHtmlCompatMixin.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import SelectionAriaMixin from '../mixins/SelectionAriaMixin.js';
import SelectionInViewMixin from '../mixins/SelectionInViewMixin.js';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin.js';


const Base =
  AttributeMarshallingMixin(
  ClickSelectionMixin(
  ContentItemsMixin(
  ContentCompatMixin(
  DirectionSelectionMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  KeyboardPagedSelectionMixin(
  KeyboardPrefixSelectionMixin(
  LitHtmlCompatMixin(
  ReactiveMixin(
  SelectionAriaMixin(
  SelectionInViewMixin(
  SingleSelectionMixin(
    HTMLElement
  ))))))))))))));


export default class ListBox extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      orientation: 'vertical'
    });
  }

  hostProps() {
    const base = super.hostProps && super.hostProps();
    const style = Object.assign(
      {},
      existingStyleProps(this),
      {
        'border': '1px solid gray',
        'box-sizing': 'border-box',
        'cursor': 'default',
        'display': 'flex',
        '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)'
      }
    );
    return mergeDeep(base, { style });
  }

  itemProps(item, index) {
    const base = super.itemProps ? super.itemProps(item, index) : {};
    const itemStyle = {
      'padding': '0.25em',
    };
    const selectedStyle = {
      'background': 'highlight',
      'color': 'highlighttext'
    };
    const selected = index === this.state.selectedIndex;
    const style = Object.assign(
      {},
      itemStyle,
      selected && selectedStyle
    );
    let className;
    if (selected) {
      className = `${base.class ? base.class + ' ' : ''}selected`;
    }
    return mergeDeep(base, {
      class: className,
      style
    });
  }

  get template() {
    const template = html`
      <style>
        #itemsContainer {
          flex: 1;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
          overflow-x: hidden;
          overflow-y: scroll;
        }
      </style>
      <div id="itemsContainer" role="none">
        ${this.renderContent()}
      </div>
    `;
    return template;
  }

}


customElements.define('elix-list-box', ListBox);
