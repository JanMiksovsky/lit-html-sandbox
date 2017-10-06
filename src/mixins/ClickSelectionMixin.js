/**
 * Mixin which maps a click (actually, a mousedown) to an item selection.
 */
export default function ClickSelectionMixin(Base) {
  return class ClickSelection extends Base {

    constructor() {
      super();
      this.addEventListener('mousedown', event => this.click(event));
    }

    click(event) {

      if (super.click) { super.click(event); }

      // Only process events for the main (usually left) button.
      if (event.button !== 0) {
        return;
      }

      // this[symbols.raiseChangeEvents] = true;

      // In some situations, the event target will not be the child which was
      // originally clicked on. E.g.,  If the item clicked on is a button, the
      // event seems to be raised in phase 2 (AT_TARGET) — but the event
      // target will be the component, not the item that was clicked on.
      // Instead of using the event target, we get the first node in the
      // event's composed path.
      // @ts-ignore
      const target = event.composedPath ?
        event.composedPath()[0] :
        event.target;

      // Find which item was clicked on and, if found, select it. For elements
      // which don't require a selection, a background click will determine
      // the item was null, in which we case we'll remove the selection.
      const targetIndex = this.indexOfTarget(target);
      const selectionRequired = this.state.selectionRequired;
      if (targetIndex >= 0 || !selectionRequired) {
        this.updateSelectedIndex(targetIndex);

        // We don't call preventDefault here. The default behavior for
        // mousedown includes setting keyboard focus if the element doesn't
        // already have the focus, and we want to preserve that behavior.
        event.stopPropagation();
      }

      // this[symbols.raiseChangeEvents] = false;
    }

  };
}
