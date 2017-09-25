import { mergeDeep } from '../mixins/helpers.js';


export default function SingleSelectionMixin(Base) {
  return class SingleSelection extends Base {

    // constructor(props) {
    //   super(props);
    //   const selectionRequired = props.selectionRequired || this.defaults.selectionRequired;
    //   const selectedIndex = props.selectedIndex !== undefined ?
    //     parseInt(props.selectedIndex) :
    //     selectionRequired && this.items.length > 0 ?
    //       0 :
    //       -1;
    //   this.state = Object.assign({}, this.state, { selectedIndex });
    //   this.updateSelectedIndex = this.updateSelectedIndex.bind(this);
    // }

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

    // componentWillReceiveProps(props) {
    //   if (super.componentWillReceiveProps) { super.componentWillReceiveProps(props); }
    //   if (props.selectedIndex != null && this.state.selectedIndex !== props.selectedIndex) {
    //     this.setState({
    //       selectedIndex: props.selectedIndex
    //     });
    //   }
    // }

    get defaultState() {
      return mergeDeep(super.defaults, {
        selectionRequired: false,
        selectionWraps: false
      });
    }

    // get items() {
    //   // Prefer base result if defined. If undefined, the default implementation
    //   // returns the component's children.
    //   return super.items || this.props.items || this.props.children;
    // }

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
