import { useEffect, useState, createContext } from 'react';
import Cards from '../../Assets/Cards';
import { useRef } from 'react';

export const DeckContext = createContext();
export const DeckProvider = ({ children }) => {
    const cardCounter = useRef(0);
    function shuffleDeck() {
        for (let i = Cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let k = Cards[i];
            Cards[i] = Cards[j];
            Cards[j] = k;
        }
    }
    useEffect(() => shuffleDeck(), []);

    function nextCard() {
        if (cardCounter.current === 51) {
            cardCounter.current = 0;
        } else {
            cardCounter.current = cardCounter.current + 1;
        }
    }
    function getCardAndMoveCursor() {
        const newCard = Cards[cardCounter.current];
        nextCard();
        return newCard;
    }

    function initGame(setHands, hands) {
        const players = JSON.parse(sessionStorage.getItem('players'));

        const createHands = players.map((c) => {
            if (c.mainBet !== 0) {
                const singleHand = [
                    [getCardAndMoveCursor(), getCardAndMoveCursor()],
                    // [
                    //     Cards.find((card) => card.id === 1),
                    //     Cards.find((card) => card.id === 3),
                    // ],
                ];
                return singleHand;
            } else {
                return [[]];
            }
        });
        const bankHand = [[getCardAndMoveCursor()]];
        // const bankHand = [[Cards.find((card) => card.id === 4)]];
        createHands.unshift(bankHand);
        setHands(createHands);
    }

    const card = Cards[cardCounter.current];
    return (
        <DeckContext.Provider value={{ card, getCardAndMoveCursor, initGame }}>
            {children}
        </DeckContext.Provider>
    );
};
