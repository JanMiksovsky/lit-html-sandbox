export default function DirectionSelectionMixin(Base) {
  return class DirectionSelection extends Base {

    goDown() {
      if (super.goDown) { return super.goDown(); }
      return this.selectNext();
    }

    goEnd() {
      if (super.goEnd) { return super.goEnd(); }
      return this.selectLast();
    }

    goLeft() {
      if (super.goLeft) { return super.goLeft(); }
      return this.rightToLeft ?
        this.selectNext() :
        this.selectPrevious();
    }

    goRight() {
      if (super.goRight) { return super.goRight(); }
      return this.rightToLeft ?
        this.selectPrevious() :
        this.selectNext();
    }

    goStart() {
      if (super.goStart) { return super.goStart(); }
      return this.selectFirst();
    }

    goUp() {
      if (super.goUp) { return super.goUp(); }
      return this.selectPrevious();
    }

  };
}
