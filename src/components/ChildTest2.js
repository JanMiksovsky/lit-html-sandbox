class ChildTest2 extends HTMLElement {

  connectedCallback() {
    console.log(`${this.localName}: ${this.childNodes.length}`);
  }

}
customElements.define('child-test2', ChildTest2);
