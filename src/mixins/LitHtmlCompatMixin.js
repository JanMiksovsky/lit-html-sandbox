import LitHtmlMixin from './LitHtmlMixin.js';
import LitHtmlShadowMixin from './LitHtmlShadowMixin.js';

export default function LitHtmlCompatMixin(Base) {
  const nativeShadow = 'shadowRoot' in Element.prototype;
  const Mixin = nativeShadow ?
    LitHtmlShadowMixin :
    LitHtmlMixin;
  return Mixin(Base);
}
