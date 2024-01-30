import styled from 'styled-components';
import { useContext, useEffect, useState, useRef } from 'react';
import colors from '../utils/styles/colors';
import {
    ThemeContext,
    HandContext,
    PlayersContext,
    nbPlayerContext,
} from '../utils/context';
import { DeckContext } from '../utils/context/DeckContext';
import Cards from '../Assets/Cards';

const StyledImage = styled.img`
    background-color: ${({ isPlaying }) =>
        isPlaying ? '#ffffff' : '#ffffff70'};
    border-radius: 10px;
    width: 120px;
    cursor: pointer;
    border: solid 6px
        ${({ colorMode, isPlaying }) =>
            isPlaying
                ? colors[colorMode].cardBorder
                : colors[colorMode].disabledCardBorder};
`;
const StyledHandWrapper = styled.div`
    display: flex;
    flex-direction: row;
    text-align: center;
`;
const StyledCardContainer = styled.div`
    display: flex;
    flex-direction: row;
`;
const StyledCard = styled.div`
    text-align: center;
`;

function BankHand({ isActive, endRound }) {
    const { theme } = useContext(ThemeContext);
    const { hands, setHands, scores } = useContext(HandContext);
    const { activePlayer } = useContext(PlayersContext);
    const { getCardAndMoveCursor } = useContext(DeckContext);
    const [cardsContainer, setCardsContainer] = useState([]);
    const isLost = useRef(false);
    const hasAceWorth11 = useRef(false);
    const hasBlackjack = useRef(false);

    useEffect(() => {
        function createCardsContainer() {
            const playerHand = hands[0][0];
            setCardsContainer(playerHand);
        }
        createCardsContainer();
    }, []);
    let sum = 0;
    function rawCardvalueCalculation() {
        const rawCardvalue = cardsContainer.map((c) => {
            if (c.value >= 10) {
                sum += 10;
                return 10;
            } else if (c.value === 1 && sum + 11 <= 21) {
                sum += 11;
                hasAceWorth11.current = true;
                return 11;
            } else {
                sum += c.value;
                return c.value;
            }
        });
        return rawCardvalue;
    }
    let cardsValues = rawCardvalueCalculation();

    function scoreCalculation(total, current) {
        let initialScore = total + current;

        if (initialScore > 22 && hasAceWorth11.current === true) {
            initialScore = initialScore - 10;
            hasAceWorth11.current = false;
        }
        if (initialScore > 21) {
            isLost.current = true;
        }
        return initialScore;
    }

    function scoreReduce() {
        const finalScore = cardsValues.reduce(
            (total, current) => scoreCalculation(total, current),
            0
        );
        scores.current[0][0] = hasBlackjack.current ? 'BJ' : finalScore;
        return finalScore;
    }

    let score = scoreReduce();
    function checkBlackJack() {
        if (cardsContainer.length === 2 && score === 21) {
            hasBlackjack.current = true;
            endRound(true);
        }
    }

    function addBanksCards() {
        function addOneCard() {
            const newHands = hands.map((c, i) => {
                const banksNewCard = getCardAndMoveCursor();
                // const banksNewCard = Cards.find((card) => card.id === 2);
                if (i === 0) {
                    const previousBankHand = c[0];
                    previousBankHand.push(banksNewCard);
                    return previousBankHand;
                } else {
                    return c;
                }
            });
            setHands(newHands);
            sum = 0;
            cardsValues = rawCardvalueCalculation();
            score = scoreReduce();
            score >= 17 && endRound(true);
        }
        addOneCard();
        checkBlackJack();

        if (!hasBlackjack.current) {
            let bankDraws = score <= 16 ? true : false;

            while (bankDraws) {
                setTimeout(addOneCard(), 1000);
                bankDraws = score <= 16 ? true : false;
            }
        }
    }
    if (activePlayer === 0 && cardsContainer.length === 1) {
        addBanksCards();
    }
    useEffect(() => sessionStorage.setItem('hands', JSON.stringify(hands)), []);
    return (
        <>
            <StyledHandWrapper>
                <StyledCardContainer>
                    {cardsContainer.map((c, i) => {
                        return (
                            <StyledCard key={i}>
                                <StyledImage
                                    // onClick={addCardAndCheckScore}
                                    colorMode={theme}
                                    src={c.imgPath}
                                    alt={c.name}
                                    isPlaying={isActive}
                                />
                            </StyledCard>
                        );
                    })}
                </StyledCardContainer>

                {score}
            </StyledHandWrapper>
        </>
    );
}
export default BankHand;
