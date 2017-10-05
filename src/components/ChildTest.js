class ChildTest extends HTMLElement {
  
  connectedCallback() {
    console.log(`${this.localName}: connectedCallback: ${this.childNodes.length}`);
    if (this.childNodes.length === 0) {
      window.addEventListener('load', () => {
        console.log(`${this.localName}: window load`);
        observer.disconnect();
      });
      const observer = new MutationObserver(() => {
        console.log(`${this.localName}: MutationObserver: ${this.childNodes.length}`);
        observer.disconnect();
      });
      observer.observe(this, { childList: true });
    }
  }

}
customElements.define('child-test', ChildTest);
