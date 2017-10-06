import LitHtmlMixin from './LitHtmlMixin.js';
import LitHtmlShadowMixin from './LitHtmlShadowMixin.js';

export default function LitHtmlCompatMixin(Base) {
  const shadyDOM = window.ShadyDOM && window.ShadyDOM.inUse;
  const nativeShadow = !shadyDOM && 'shadowRoot' in Element.prototype;
  const Mixin = nativeShadow ?
    LitHtmlShadowMixin :
    LitHtmlMixin;
  return Mixin(Base);
}
