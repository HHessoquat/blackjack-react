import {
    BetsContext,
    HandContext,
    PlayersContext,
    ThemeContext,
    nbPlayerContext,
} from '../utils/context';
import styled from 'styled-components';
import colors from '../utils/styles/colors';
import { useContext } from 'react';
import Hand from './Hand';

const StyledPlayerAndHand = styled.div`
    flex: 1;
    max-width: 400px;
`;

const StyledPlayer = styled.div`
    width: 100%;
    color: ${({ isActivePlayer }) =>
        isActivePlayer ? '#ffffff' : '#ffffff90'};
`;
const StyledName = styled.div`
    font-size: 18pt;
    background-color: ${({ isActivePlayer, colorMode }) =>
        isActivePlayer
            ? colors[colorMode].field
            : colors[colorMode].disabledField};
    text-align: center;
    margin-right: 10px;
    margin-left: 10px;
    margin-top: 5px;
    border-radius: 2px;
    padding-top: 3px;
    padding-bottom: 5px;
`;
const StyledInformation = styled.p`
    margin-left: 10px;
    text-align: center;
    line-height: 2.2;
`;
const StyledHandsContainer = styled.div`
    width: 110%;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-content: flex-start;
`;

function Player({ player, betSequence, endRound }) {
    const id = player['id'];
    const name = player['playersName'];
    const money = player['money'];
    const isBetEnabled = player['canBet'];
    const initialBet = player['initialBet'];
    const totalBets = player['totalBets'];
    const insurance = player.insurance;
    const { activePlayer, skipPlayer } = useContext(PlayersContext);
    const { theme } = useContext(ThemeContext);
    const { hands, activeHand } = useContext(HandContext);
    const { bets } = useContext(BetsContext);
    const { nbPlayer } = useContext(nbPlayerContext);

    function defineActivityStatus() {
        if (betSequence.current || activePlayer === id || activePlayer === 0) {
            return true;
        } else return false;
    }
    const isActive = defineActivityStatus();

    if (!betSequence.current && activePlayer === id) {
        skipPlayer(nbPlayer);
    }

    return (
        <StyledPlayerAndHand>
            <StyledPlayer isActivePlayer={isActive}>
                <StyledName colorMode={theme} isActivePlayer={isActive} id={id}>
                    {name}
                </StyledName>
                <StyledInformation>Money: {money}</StyledInformation>
            </StyledPlayer>
            <StyledHandsContainer>
                {!betSequence.current && initialBet
                    ? hands[id].map((c, i) => {
                          const isHandActive =
                              (isActive && i === activeHand) || endRound
                                  ? true
                                  : false;
                          return (
                              <Hand
                                  key={'key' + id + i}
                                  player={player}
                                  isActive={isHandActive}
                                  bet={initialBet}
                                  handId={i}
                              />
                          );
                      })
                    : ''}
            </StyledHandsContainer>
        </StyledPlayerAndHand>
    );
}
export default Player;
