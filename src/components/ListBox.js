import { html } from '../../node_modules/lit-html/lit-html.js';
import { formatStyleProps, mergeDeep } from '../mixins/helpers.js';
import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import DefaultSlotContentMixin from '../mixins/DefaultSlotContentMixin.js';
import LitHtmlShadowMixin from '../mixins/LitHtmlShadowMixin.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin.js';


const Base =
  AttributeMarshallingMixin(
  ContentItemsMixin(
  DefaultSlotContentMixin(
  LitHtmlShadowMixin(
  ReactiveMixin(
  SingleSelectionMixin(
    HTMLElement
  ))))));


export default class ListBox extends Base {

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
    const style = mergeDeep(
      itemStyle,
      selected && selectedStyle
    );
    // const className = classnames(
    //   item.props.className,
    //   base.className,
    //   {
    //     selected
    //   }
    // );
    // return Object.assign(
    //   {},
    //   base,
    //   {
    //     className,
    //     style
    //   }
    // );
    return mergeDeep(base, { style });
  }

  get template() {
    const template = html`
      <style>
        :host {
          border: 1px solid gray;
          box-sizing: border-box;
          cursor: default;
          display: flex;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }

        #itemsContainer {
          flex: 1;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
          overflow-x: hidden;
          overflow-y: scroll;
        }
      </style>
      <div id="itemsContainer" role="none">
        <slot></slot>
      </div>
    `;
    return template;
  }

}


customElements.define('elix-list-box', ListBox);
