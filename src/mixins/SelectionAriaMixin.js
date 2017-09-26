export default function SelectionAriaMixin(Base) {
  return class SelectionAria extends Base {

    itemProps(item, index) {
      const base = super.itemProps ? super.itemProps(item, index) : {};
      const selected = index === this.state.selectedIndex;
      return Object.assign({}, base, {
        'aria-selected': selected,
        'role': base.role || 'option'
      });
    }

    hostProps() {
      const base = super.hostProps ? super.hostProps() : {};
      return Object.assign({}, base, {
        'role': base.role || 'listbox'
      });
    }

  };
}
