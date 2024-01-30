import Hand from 'react'
class BankHand extends Hand {
    constructor(id, card) {
        super(id, card);
        this.blackjackPossible = false
    }

    setBlakjackPossible(validation) {
        this.blackjackPossible = validation;
    }

    isBlackjackpossible() {
        return this.blackjackPossible;
    }
}
export default BankHand