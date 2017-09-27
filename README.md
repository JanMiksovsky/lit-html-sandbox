This repo experiments with creating web components using an FRP (Functional Reactive Programming) architecture.

As with React and other FRP systems, components track state in a read-only `this.state` member, and update state with calls to `this.setState()`. A call to `setState` in turn triggers a call to a `render()` method which is responsible for updating the DOM to reflect the new state.

Depending upon the component, updating the DOM may require any of the following three types of specific updates:

1. Updating a component's **shadow subtree**. The components here do this via the small and fast [lit-html](https://github.com/PolymerLabs/lit-html/) library. Here, a component defines a `template` property that uses a JavaScript template literal to return a lit-html `TemplateResult`.
2. Updating a component's **host node**. Certain element behaviors, such as ARIA semantics, can only be achieved by setting properties or attributes (e.g., `role`, `aria-activedescendant`) on the component's host element. Here, components define a method, `this.hostProps()`, which should return an object whose keys correspond to properties (or, in special cases, attributes) that should be applied to the host.
3. Updating **nodes assigned to a slot**. Like #2 above, but in this case, the component needs to modify light DOM nodes assigned to one or more of the component's slots. E.g., a list component may set properties or attributes (such as `aria-selected`) on the nodes in the list. For this, components define a method `this.itemProps(item, index)` that returns the properties and attributes that should be applied to a given "item" (assigned node).

As with other Elix projects, this experiment makes heavy use of a [mixin architecture](https://elix.org/documentation/mixins) to define component behavior. In this case, the above requirements are addressed with three mixins, each of which augment the `render()` method to handle a specific type of DOM update:

* `LitHtmlShadowMixin` is used by any component with a shadow subtree.
* `ReactiveMixin` handles host node updates, and reactive state generally.
* `ContentItemsMixin` handles items in list-like components.

Example: A single-selection list component might support ARIA selection with:

    const Base = LitHtmlShadowMixin(ReactiveMixin(ContentItemsMixin(HTMLElement)));

    class SingleSelectionList extends Base {

      // Return a lit-html template for the component's shadow DOM.
      get tempate() {
        // Any nodes assigned to this slot will be updated with `itemProps`.
        return html`<slot></slot>`.
      }

      // Return props/attributes to apply to the component's host element.
      hostProps() {
        const base = super.hostProps ? super.hostProps() : {};
        const selectedItem = this.state.selectedIndex > 0 && this.state.items ?
          this.state.items[this.state.selectedIndex] :
          null;
        const selectedItemId = selectedItem && selectedItem.id;
        return Object.assign({}, base, {
          'aria-activedescendant': selectedItemId,
          'role': base.role || 'listbox'
        });
      }

      // Return props/attributes to apply to the indexth assigned node.
      itemProps(item, index) {
        const base = super.itemProps ? super.itemProps(item, index) : {};
        const selected = index === this.state.selectedIndex;
        return Object.assign({}, base, {
          'aria-selected': selected,
          'role': base.role || 'option'
        });
      }

    }

Both the `hostProps` and `itemProps` methods take care to invoke `super` in case other mixins want to contribute properties.

Note: In practice, handling ARIA is more complex, and is addressed through a separate mixin, `SelectionAriaMixin`.