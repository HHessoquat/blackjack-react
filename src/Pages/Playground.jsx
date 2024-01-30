import Player from '../Components/Player';
import Bank from '../Components/Bank';
import Hand from '../Components/Hand';
import BetInfo from '../Components/BetInfo';
import DecorativeBlackjack from '../Components/DecorativeBlackjack';
import BetForm from '../Components/BetForm';
import ActionPlayersButtons from '../Components/ActionPlayersButtons';
import EndGameForm from '../Components/EndGameForm';
import styled from 'styled-components';
import colors from '../utils/styles/colors';
import { useContext, useEffect, useRef } from 'react';
import {
    BetsContext,
    HandContext,
    PlayerNameContext,
    PlayersContext,
    nbPlayerContext,
} from '../utils/context';
import Deck from '../Components/Deck';
import { useState } from 'react';

const StyledPlayground = styled.div`
    display: grid;
    grid-template-rows: 20vh 270px 40vh;
    grid-template-columns: 20px 1fr 1fr 1fr 1fr 20px;
`;

const StyledPlayercontainer = styled.div`
    grid-row: 3/4;
    grid-column: 2/6;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
`;

const StyledBetFormContainer = styled.div`
    grid-row: 1/3;
    grid-column: 2/6;
`;
const StyledEndGameForm = styled.div`
    grid-row: 2/3;
    grid-column: 2/6;
`;

const StyledBankContainer = styled.div`
    grid-row: 1/2;
    grid-column: 2/6;
    display: flex;
    justify-content: center;
    margin-top: -25px;
`;

const StyledActionButtons = styled.div`
    grid-row: 2/3;
    grid-column: ${({ active }) => {
        const columnPlacement = active + 1 + '/' + (active + 1);
        return columnPlacement;
    }};
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;

function Playground() {
    const { players, setPlayers, activePlayer } = useContext(PlayersContext);
    const betSequence = useRef();
    const { nbPlayer } = useContext(nbPlayerContext);
    const { playersName } = useContext(PlayerNameContext);
    const [endRound, setEndRound] = useState(false);
    const { hands } = useContext(HandContext);

    if (sessionStorage.getItem('bets') != null) {
        betSequence.current = false;
    } else {
        betSequence.current = true;
    }

    function createPlayers() {
        if (sessionStorage.getItem('players') == null) {
            const nbPlayersToCreate = Array.from(
                { length: nbPlayer },
                (x, i) => i
            );

            return nbPlayersToCreate.map((c, i) => ({
                id: i + 1,
                playersName: playersName[i],
                money: 100,
                blackjack: false,
                canBet: true,
                initialBet: [0],
                totalBets: 0,
                insurance: [0],
            }));
        } else {
            let existingPlayers = sessionStorage.getItem('players');
            existingPlayers = JSON.parse(existingPlayers);
            return existingPlayers;
        }
    }
    useEffect(() => {
        setPlayers(createPlayers());
    }, []);
    return (
        <>
            <StyledPlayground>
                {/* <DecorativeBlackjack /> */}
                {!betSequence.sequence && (
                    <StyledBankContainer>
                        <Bank
                            betSequence={betSequence}
                            endRound={setEndRound}
                        />
                    </StyledBankContainer>
                )}
                {/* <Deck /> */}
                {/* <BetInfo /> */}
                {betSequence.current && (
                    <StyledBetFormContainer>
                        <BetForm setBetSequence={betSequence} />
                    </StyledBetFormContainer>
                )}

                {endRound && (
                    <StyledEndGameForm>
                        <EndGameForm
                            betSequence={betSequence}
                            endRound={setEndRound}
                        />
                    </StyledEndGameForm>
                )}

                <StyledPlayercontainer>
                    {players.map((c, i) => (
                        <Player
                            key={c.id}
                            player={players[i]}
                            betSequence={betSequence}
                            endRound={endRound}
                        />
                    ))}
                </StyledPlayercontainer>
                {!betSequence.current && !endRound && activePlayer !== 0 && (
                    <StyledActionButtons active={activePlayer}>
                        <ActionPlayersButtons />
                    </StyledActionButtons>
                )}
            </StyledPlayground>
        </>
    );
}
export default Playground;
