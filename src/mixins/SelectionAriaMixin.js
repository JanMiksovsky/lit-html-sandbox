// Used to assign unique IDs to item elements without IDs.
let idCount = 0;


export default function SelectionAriaMixin(Base) {
  return class SelectionAria extends Base {

    itemProps(item, index) {
      const base = super.itemProps ? super.itemProps(item, index) : {};
      const selected = index === this.state.selectedIndex;
      // Ensure each item has an ID so we can set aria-activedescendant on the
      // overall list whenever the selection changes.
      //
      // The ID will take the form of a base ID plus a unique integer. The base
      // ID will be incorporate the component's own ID. E.g., if a component has
      // ID "foo", then its items will have IDs that look like "_fooOption1". If
      // the compnent has no ID itself, its items will get IDs that look like
      // "_option1". Item IDs are prefixed with an underscore to differentiate
      // them from manually-assigned IDs, and to minimize the potential for ID
      // conflicts.
      let id;
      if (!item.id) {
        const baseId = this.id ?
          "_" + this.id + "Option" :
          "_option";
        id = baseId + idCount++;
      }
      return Object.assign({}, base, {
        'aria-selected': selected,
        'role': base.role || 'option'
        },
        id && { id }
      );
    }

    hostProps() {
      const base = super.hostProps ? super.hostProps() : {};
      const selectedItem = this.state.selectedIndex >= 0 && this.items ?
        this.items[this.state.selectedIndex] :
        null;
      const selectedItemId = selectedItem && selectedItem.id;
      return Object.assign({}, base, {
        'aria-activedescendant': selectedItemId,
        'role': base.role || 'listbox'
      });
    }

  };
}
