import styled from 'styled-components';
import colors from '../utils/styles/colors';
import {
    HandContext,
    PlayersContext,
    ThemeContext,
    nbPlayerContext,
    BetsContext,
} from '../utils/context';
import { DeckContext } from '../utils/context/DeckContext';
import { useContext } from 'react';

const StyledButtonWrapper = styled.div`
    margin: 5;
    display: flex;
    flex-flow: row wrap-reverse;
    justify-content: space-around;
    padding: 20px;
`;
const StyledActionPlayerButton = styled.button`
    height: 30px;
    width: 120px;
    margin-bottom: 15px;
`;

function ActionPlayersButtons() {
    const { theme } = useContext(ThemeContext);
    const { activePlayer, switchActivePlayer } = useContext(PlayersContext);
    const { getCardAndMoveCursor } = useContext(DeckContext);
    const {
        hands,
        setHands,
        activeHand,
        switchActiveHand,
        setActiveHand,
        scores,
    } = useContext(HandContext);
    const { players, setPlayers } = useContext(PlayersContext);
    const { nbPlayer } = useContext(nbPlayerContext);
    const { bets, setBets } = useContext(BetsContext);
    console.log(bets);
    function addCard() {
        const newCard = getCardAndMoveCursor();
        const previousHand = hands[activePlayer];
        const newHands = hands.map((c, i) => {
            if (i === activePlayer) {
                previousHand[activeHand].push(newCard);
                return previousHand;
            } else {
                return c;
            }
        });
        setHands(newHands);
    }

    function isPaymentEnabled(value) {
        const enabled =
            players[activePlayer - 1].money >= value &&
            players[activePlayer - 1].canBet
                ? true
                : false;
        return enabled;
    }
    function updateBets(newBet, betsTarget) {
        const PlayersAfterBet = players.map((c, i) => {
            if (i === activePlayer - 1) {
                c.money = c.money - newBet;
                c.totalBets += newBet;

                if (c.money <= 0) {
                    c.canBet = false;
                }
                return c;
            } else {
                return c;
            }
        });

        const updatedBets = bets.map((c, i) => {
            if (i === activePlayer - 1) {
                if (betsTarget === 'activeBet') {
                    c[activeHand] = c[activeHand] + newBet;
                } else if (betsTarget === 'splitBet') {
                    c = [...c, newBet];
                }
                return c;
            } else {
                return c;
            }
        });
        setPlayers(PlayersAfterBet);
        setBets(updatedBets);
    }
    function togglePlayer() {
        switchActivePlayer(nbPlayer);
        setActiveHand(0);
    }
    function nextHandOrPlayer() {
        const nbHands = hands[activePlayer].length - 1;
        activeHand >= nbHands ? togglePlayer() : switchActiveHand(nbHands);
    }
    function savePlayersAndHands() {
        sessionStorage.setItem('hands', JSON.stringify(hands));
        sessionStorage.setItem('players', JSON.stringify(players));
    }

    function handleCardClick() {
        addCard();
        savePlayersAndHands();
    }
    function handleStayClick() {
        nextHandOrPlayer();
    }

    function handleDoubleDownClick() {
        const newBet = players[activePlayer - 1].initialBet;
        const isAllowed = isPaymentEnabled(newBet);

        if (isAllowed) {
            const betsTarget = 'activeBet';
            updateBets(newBet, betsTarget);
            addCard();
            nextHandOrPlayer();
        }
        savePlayersAndHands();
    }
    function handleSplitClick() {
        const newBet = players[activePlayer - 1].initialBet;
        const isAllowed = isPaymentEnabled(newBet);
        if (isAllowed) {
            const betsTarget = 'splitBet';
            updateBets(newBet, betsTarget);
            const firstCard = hands[activePlayer][activeHand][0];
            const secondCard = hands[activePlayer][activeHand][1];
            const newCard = getCardAndMoveCursor();
            const splittedHands = hands[activePlayer].map((c, i) => {
                return i === activeHand ? [firstCard, newCard] : c;
            });
            splittedHands.push([secondCard]);

            const allHands = hands.map((c, i) => {
                if (i === activePlayer) {
                    c = splittedHands;
                    return c;
                } else {
                    return c;
                }
            });
            setHands(allHands);
        }
        savePlayersAndHands();
    }

    function handleInsuranceClick() {
        const insuranceValue = players[activePlayer - 1].initialBet / 2;

        const isAllowed = isPaymentEnabled(insuranceValue);
        if (isAllowed) {
            const updatedPlayers = players.map((c, i) => {
                if (i === activePlayer - 1) {
                    c.money -= insuranceValue;
                    c.insurance[activeHand] = insuranceValue;
                    c.totalBets += insuranceValue;
                    if (c.money <= 0) {
                        c.canBet = false;
                    }
                    return c;
                } else {
                    return c;
                }
            });
            setPlayers(updatedPlayers);
        }
        savePlayersAndHands();
    }
    const playerDrew = hands[activePlayer][activeHand].length > 2;
    const bankCanBlackjack =
        hands[0][0][0].value >= 10 || hands[0][0][0].value === 1;
    const playerHas21 =
        scores.current[activePlayer][activeHand] >= 21 ||
        scores.current[activePlayer][activeHand] === 'BJ';

    return (
        <>
            <StyledButtonWrapper colorMode={theme}>
                {!playerHas21 && (
                    <StyledActionPlayerButton
                        colorMode={theme}
                        onClick={handleCardClick}
                    >
                        Carte !
                    </StyledActionPlayerButton>
                )}
                <StyledActionPlayerButton
                    colorMode={theme}
                    onClick={handleStayClick}
                >
                    Reste !
                </StyledActionPlayerButton>
                {!playerDrew && !playerHas21 ? (
                    <StyledActionPlayerButton
                        colorMode={theme}
                        onClick={handleDoubleDownClick}
                    >
                        Double down !!!
                    </StyledActionPlayerButton>
                ) : (
                    ''
                )}
                {!playerDrew &&
                    hands[activePlayer][activeHand][0].value ===
                        hands[activePlayer][activeHand][1].value && (
                        <StyledActionPlayerButton
                            colorMode={theme}
                            onClick={handleSplitClick}
                        >
                            Split !
                        </StyledActionPlayerButton>
                    )}

                {bankCanBlackjack &&
                !players[activePlayer - 1].insurance[activeHand] &&
                !playerDrew ? (
                    <StyledActionPlayerButton
                        colorMode={theme}
                        onClick={handleInsuranceClick}
                    >
                        Assurance !
                    </StyledActionPlayerButton>
                ) : (
                    ''
                )}
            </StyledButtonWrapper>
        </>
    );
}

export default ActionPlayersButtons;
