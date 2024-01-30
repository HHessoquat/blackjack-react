import styled from 'styled-components';
import { useContext, useEffect, useState, useRef } from 'react';
import colors from '../utils/styles/colors';
import {
    ThemeContext,
    HandContext,
    PlayersContext,
    nbPlayerContext,
    BetsContext,
} from '../utils/context';
import { DeckContext } from '../utils/context/DeckContext';

const StyledImage = styled.img`
    background-color: ${({ isPlaying }) => (isPlaying ? '#ffffff' : '#5c5c5c')};
    border-radius: 10px;
    width: 120px;
    cursor: pointer;
    border: solid 6px
        ${({ colorMode, isPlaying }) =>
            isPlaying
                ? colors[colorMode].cardBorder
                : colors[colorMode].disabledCardBorder};
    margin-left: ${({ index }) => (index === 0 ? '0px' : '-110px')};
`;
const StyledHandWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;
const StyledCard = styled.div`
    text-align: center;
`;

const StyledHandInfo = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    width: 140px;
`;
const StyledCardContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 8px;
`;
const StyledInfo = styled.p`
    color: #6a6a6a;
    font-size: 11pt;
`;

function Hand({ player, isActive, handId }) {
    const { theme } = useContext(ThemeContext);
    const { hands, activeHand, setActiveHand, switchActiveHand, scores } =
        useContext(HandContext);
    const { nbPlayer } = useContext(nbPlayerContext);
    const { activePlayer, switchActivePlayer } = useContext(PlayersContext);
    const { getCardAndMoveCursor } = useContext(DeckContext);
    const [cardsContainer, setCardsContainer] = useState([]);
    const isLost = useRef(false);
    const hasAceWorth11 = useRef(false);
    const hasBlackjack = useRef(false);
    const { bets } = useContext(BetsContext);

    function createCardsContainer() {
        const playerHand = hands[player.id][handId];

        setCardsContainer(playerHand);
    }
    useEffect(() => {
        createCardsContainer();
    }, [hands]);

    function togglePlayer() {
        switchActivePlayer(nbPlayer);
        setActiveHand(0);
    }
    function nextHandOrPlayer() {
        const nbHands = hands[activePlayer].length - 1;
        activeHand >= nbHands ? togglePlayer() : switchActiveHand(nbHands);
    }

    if (
        activeHand !== 0 &&
        activeHand === handId &&
        cardsContainer.length === 1
    ) {
        const newcard = getCardAndMoveCursor();
        const secondHandStart = cardsContainer;
        secondHandStart.push(newcard);
        setCardsContainer(secondHandStart);
    }

    function rawCardvalueCalculation() {
        let sum = 0;
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

        if (initialScore > 21 && hasAceWorth11.current === true) {
            initialScore = initialScore - 10;
            hasAceWorth11.current = false;
        }
        if (initialScore > 21) {
            isLost.current = true;
            activePlayer === player.id &&
                handId === activeHand &&
                nextHandOrPlayer();
        }
        return initialScore;
    }

    function scoreReduce() {
        const finalScore = cardsValues.reduce(
            (total, current) => scoreCalculation(total, current),
            0
        );
        scores.current[player.id][handId] = hasBlackjack.current
            ? 'BJ'
            : finalScore;
        return finalScore;
    }
    const score = scoreReduce();
    function checkBlackJack() {
        if (
            activePlayer === player.id &&
            activeHand === handId &&
            cardsContainer.length === 2 &&
            score === 21
        ) {
            hasBlackjack.current = true;
            const bankCanBlackjack =
                hands[0][0][0].value >= 10 || hands[0][0][0].value === 1;

            !bankCanBlackjack && nextHandOrPlayer();
        }
    }

    checkBlackJack();
    // useEffect(() => {
    //     sessionStorage.setItem('hands', JSON.stringify(hands));
    // }, []);
    return (
        <StyledHandWrapper>
            <StyledHandInfo>
                <StyledInfo>Mise : {bets[player.id - 1][handId]}</StyledInfo>
                <StyledInfo>score : {score}</StyledInfo>
                {player.insurance[handId] ? (
                    <StyledInfo> Assurance</StyledInfo>
                ) : (
                    ''
                )}
            </StyledHandInfo>

            <StyledCardContainer>
                {cardsContainer.map((c, i) => {
                    return (
                        <StyledCard key={i}>
                            <StyledImage
                                colorMode={theme}
                                index={i}
                                src={c.imgPath}
                                alt={c.name}
                                isPlaying={isActive}
                            />
                        </StyledCard>
                    );
                })}{' '}
            </StyledCardContainer>
        </StyledHandWrapper>
    );
}
export default Hand;
