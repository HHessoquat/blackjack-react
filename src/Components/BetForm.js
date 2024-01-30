import { useContext, useState } from 'react';
import styled from 'styled-components';
import colors from '../utils/styles/colors';
import {
    BetsContext,
    PlayersContext,
    ThemeContext,
    HandContext,
} from '../utils/context';
import { DeckContext } from '../utils/context/DeckContext';

const StyledBetForm = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: ${({ colorMode }) => colors[colorMode].form};
    border: 3px solid ${({ colorMode }) => colors[colorMode].boxBorder};
    border-radius: 8px;
    margin: auto;
    width: 400px;
    max-height: 400px;
`;
const StyledMessageError = styled.p`
    text-align: center;
    color: ${({ colorMode }) => colors[colorMode].boxBorder};
    margin-top: 10px;
`;
const StyledFormTitle = styled.h6`
    font-size: 1.08em;
    margin: 0;
    background-color: ${({ colorMode }) => colors[colorMode].field};
    padding-top: 5px;
    padding-bottom: 5px;
    width: 80%;
    text-align: center;
    border-radius: 4px;
`;
const StyledinputField = styled.div`
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const StyledBetInput = styled.input`
    width: 150px;
    margin-top: 7px;
`;
const StyledBetButton = styled.button`
    margin-top: 14px;
    width: 80%;
    font-weight: bold;
    padding-top: 8px;
    padding-bottom: 5px;
    font-size: 1.05em;
`;

function BetForm({ BetSequence }) {
    const { theme } = useContext(ThemeContext);
    const { players, setPlayers } = useContext(PlayersContext);
    const { initGame } = useContext(DeckContext);
    const { hands, setHands } = useContext(HandContext);

    const { bets, setBets } = useContext(BetsContext);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const { sumBets } = useContext(BetsContext);

    function updateBets(newValue, playerIndex) {
        if (isNaN(newValue)) {
            setError(true);
            setErrorMessage(
                'Vous ne pouvez utiliser que des valeurs numériques'
            );
        } else if (newValue.includes('-')) {
            setError(true);
            setErrorMessage('Une mise ne peut pas être négative');
        } else if (players[playerIndex].canBet === false) {
            setError(true);
            setErrorMessage(
                players[playerIndex].playersName + ' ne peut plus miser'
            );
        } else if (newValue > players[playerIndex].money) {
            setError(true);
            setErrorMessage(
                players[playerIndex].playersName +
                    ' ne peut pas miser cette somme'
            );
        } else {
            setError(false);
            let updatedBet = bets.map((c, i) => {
                if (playerIndex === i) {
                    newValue = [parseFloat(newValue)];

                    if (isNaN(newValue)) {
                        newValue = [0];
                    }
                    return newValue;
                } else {
                    return c;
                }
            });
            setBets(updatedBet);
        }
    }
    function handleClick(betSequence) {
        const checkBet = sumBets;

        if (checkBet === 0) {
            setError(true);
            setErrorMessage('Au moins un joueur doit miser');
        } else {
            betSequence.current = false;

            const playersAfterBet = players.map((c, i) => {
                bets[i][0] = bets[i][0] > c.money ? 0 : bets[i][0];
                c.money = c.money - bets[i][0];
                if (c.money <= 0) {
                    c.canBet = false;
                }
                c.initialBet = bets[i][0];
                c.totalBets = bets[i][0];
                return c;
            });
            setPlayers(playersAfterBet);
            sessionStorage.setItem('players', JSON.stringify(playersAfterBet));
            sessionStorage.setItem('bets', JSON.stringify(bets));
            initGame(setHands, hands);
        }
    }
    return (
        <StyledBetForm colorMode={theme}>
            <StyledFormTitle colorMode={theme}>
                Les paris sont ouverts
            </StyledFormTitle>
            {players.map((c, i) => {
                if (c.canBet !== false) {
                    return (
                        <StyledinputField key={c.id}>
                            <label key={players[i].id + 20}>
                                Mise {c.playersName} :{' '}
                            </label>
                            <StyledBetInput
                                key={c.id * 4}
                                type="text"
                                value={bets[i][0]}
                                onChange={(e) => updateBets(e.target.value, i)}
                                onBlur={() => setError(false)}
                            />
                        </StyledinputField>
                    );
                } else {
                    return '';
                }
            })}
            {error && (
                <StyledMessageError colorMode={theme}>
                    {errorMessage}
                </StyledMessageError>
            )}
            <StyledBetButton onClick={handleClick}>Valider</StyledBetButton>
        </StyledBetForm>
    );
}

export default BetForm;
