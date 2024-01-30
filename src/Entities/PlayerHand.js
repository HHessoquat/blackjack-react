import Hand from './react'

class PlayerHand extends Hand {
    constructor(id, card) {
        super(id,card);
        this.splittable = false;
    }

    setSplittable(validation) {
        this.splittable = validation;
    }

    isSplittable() {
        return this.splittable;
    }
}
export default PlayerHand