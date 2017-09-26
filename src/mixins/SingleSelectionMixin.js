import { mergeDeep } from '../mixins/helpers.js';


export default function SingleSelectionMixin(Base) {
  return class SingleSelection extends Base {

    get canSelectNext() {
      const count = this.items ? this.items.length : 0;
      const selectedIndex = this.state.selectedIndex;
      return count === 0 ?
        false :
        this.state.selectionWraps || selectedIndex < 0 || selectedIndex < count - 1;
    }

    get canSelectPrevious() {
      const count = this.items ? this.items.length : 0;
      const selectedIndex = this.state.selectedIndex;
      return count === 0 ?
        false :
        this.state.selectionWraps || selectedIndex < 0 || selectedIndex > 0;
    }

    get defaultState() {
      return mergeDeep(super.defaults, {
        selectedIndex: -1,
        selectionRequired: false,
        selectionWraps: false
      });
    }

    componentDidUpdate() {
      if (super.componentDidUpdate) { super.componentDidUpdate(); }

      // In case selected item changed position or was removed.
      trackSelectedItem(this);

      // In case the change in items affected which navigations are possible.
      // updatePossibleNavigations(this);
    }

    selectFirst() {
      if (super.selectFirst) { super.selectFirst(); }
      return selectIndex(this, 0);
    }

    get selectionWraps() {
      return this.props.state.selectionWraps || this.defaults.state.selectionWraps;
    }

    selectLast() {
      if (super.selectLast) { super.selectLast(); }
      return selectIndex(this, this.items.length - 1);
    }

    selectNext() {
      if (super.selectNext) { super.selectNext(); }
      return selectIndex(this, this.state.selectedIndex + 1);
    }

    selectPrevious() {
      if (super.selectPrevious) { super.selectPrevious(); }
      return selectIndex(this, this.state.selectedIndex - 1);
    }

    updateSelectedIndex(selectedIndex) {
      const changed = this.state.selectedIndex !== selectedIndex;
      if (changed) {
        // if (this.props.onSelectedIndexChanged) {
        //   this.props.onSelectedIndexChanged(selectedIndex);
        // } else {
          this.setState({ selectedIndex });
        // }
      }
      return changed;
    }

  };
}


function selectIndex(component, index) {

  const items = component.state.items;
  if (items == null) {
    // Nothing to select.
    return false;
  }

  const count = items.length;
  const boundedIndex = component.state.selectionWraps ?
    // JavaScript mod doesn't handle negative numbers the way we want to wrap.
    // See http://stackoverflow.com/a/18618250/76472
    ((index % count) + count) % count :

    // Keep index within bounds of array.
    Math.max(Math.min(index, count - 1), 0);

  return component.updateSelectedIndex(boundedIndex);
}


/**
 * Following a change in the set of items, or in the value of the
 * `selectionRequired` property, reacquire the selected item. If it's moved,
 * update `selectedIndex`. If it's been removed, and a selection is required,
 * try to select another item.
 */
function trackSelectedItem(component) {

  const items = component.state.items;
  const itemCount = items ? items.length : 0;
  const previousSelectedIndex = component.state.selectedIndex;

  if (previousSelectedIndex >= 0) {
    // Select the item at the same index (if it exists) or as close as possible.
    // If there are no items, we'll set the index to -1 (no selection).
    const newSelectedIndex = Math.min(previousSelectedIndex, itemCount - 1);
    component.updateSelectedIndex(newSelectedIndex);
  } else if (component.state.selectionRequired && itemCount > 0) {
    // No item was previously selected; select the first item by default.
    component.updateSelectedIndex(0);
  }
}
