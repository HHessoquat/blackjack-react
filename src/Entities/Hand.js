import Card from 'react'

class Hand {

    constructor(id, card) {
        this.id = id;
        this.card = [card];
        this.score = card.value;
        this.aceWorth11 = false;
        this.blackjack = false;
    }
    getId() {
        return this.id;
    }
    setCard(Card: Card) {
        if (typeof Card == 'object') {
            this.Card.push(Card);
        }
        else {alert('it seems that the thing added to the hand was not a card')}
    }
}
export default Hand