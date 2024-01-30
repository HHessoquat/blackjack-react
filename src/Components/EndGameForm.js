import styled from 'styled-components';
import {
    BetsContext,
    PlayersContext,
    HandContext,
    ThemeContext,
} from '../utils/context';
import { useContext } from 'react';
import colors from '../utils/styles/colors';

const StyledEndGameForm = styled.div`
    border: solid 2px ${({ colormode }) => colors[colormode].boxBorder};
    width: 500px;
    border-radius: 6px;
    margin: auto;
    text-align: center;
    background-color: ${({ colormode }) => colors[colormode].form};
    margin-top: 30px;
    padding-top: 20px;
    padding-bottom: 30px;
    max-height: 170px;
`;

const StyledNextRoundButton = styled.button`
    margin-top: 15px;
    width: 115px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-weight: bold;
`;
const StyledGainMessage = styled.p`
    line-height: 1.8;
`;

function EndGameForm({ betSequence, endRound }) {
    const { bets, resetBets } = useContext(BetsContext);
    const { players, setPlayers, resetActivePlayer } =
        useContext(PlayersContext);
    const { resetHands } = useContext(HandContext);
    const { scores, resetScores } = useContext(HandContext);
    const { theme } = useContext(ThemeContext);

    let results;
    const bankScore = scores.current[0][0] > 21 ? 1 : scores.current[0][0];
    function defineResults() {
        const playersScores = scores.current.filter((c, i) => {
            return i !== 0;
        });
        results = playersScores.map((c, i) => {
            const individualResult = c.map((current) => {
                if (current === 'BJ') {
                    return bankScore === 'BJ' ? 1 : 'BJwin';
                } else if (bankScore === 'BJ') {
                    return 0;
                } else {
                    if (current > 21) {
                        return 0;
                    } else if (current < bankScore) {
                        return 0;
                    } else if (current === bankScore) {
                        return 1;
                    } else if (current > bankScore) {
                        return 2;
                    } else {
                        return "this shoudln't have happen";
                    }
                }
            });
            return individualResult;
        });
    }
    defineResults();

    function proceedPayment(paymentsValue) {
        const newPlayers = players.map((c, i) => {
            c.money = c.money + paymentsValue[i];
            c.money > 0 ? (c.canBet = true) : (c.canBet = false);
            return c;
        });
        // setPlayers(newPlayers);
    }
    function calculPaymentandPay() {
        const paymentValue = results.map((element, index) => {
            const playerGains = element.map((c, i) => {
                const singleBet = bets[index][i];
                if (c === 0) {
                    return 0;
                } else if (c === 1) {
                    return singleBet;
                } else if (c === 2) {
                    return singleBet * 2;
                } else {
                    return singleBet * 2.5;
                }
            });
            let playerFinalGain = playerGains.reduce((total, current) => {
                return total + current;
            }, 0);
            let insurancePayment = 0;
            if (bankScore === 'BJ' && players[index].insurance) {
                const totalInsurance = players[index].insurance.reduce(
                    (total, currentValue) => {
                        return total + currentValue;
                    },
                    0
                );
                insurancePayment = totalInsurance * 2;
            }
            playerFinalGain += insurancePayment;
            return playerFinalGain;
        });
        proceedPayment(paymentValue);
        return paymentValue;
    }
    const allGains = calculPaymentandPay();

    function handleNextRoundClick() {
        resetHands();
        resetBets();
        resetActivePlayer();
        resetScores();
        betSequence.current = true;
        const nextRoundPlayers = players.map((c) => {
            c.blackjack = false;
            c.initialBet = [0];
            c.insurance = [0];
            return c;
        });
        setPlayers(nextRoundPlayers);
        sessionStorage.removeItem('bets');
        endRound(false);
    }
    function ResultMessage({ index }) {
        const individualGain = allGains[index] - players[index].totalBets;
        if (individualGain > 0) {
            return ' gagne ' + individualGain;
        } else if (individualGain === 0) {
            return ' récupère sa mise';
        } else {
            return ' perd ' + individualGain * -1;
        }
    }

    return (
        <StyledEndGameForm colormode={theme}>
            {players.map((c, i) => {
                return (
                    <>
                        {c.initialBet ? (
                            <StyledGainMessage key={i + c.id}>
                                {c.playersName} <ResultMessage index={i} />
                            </StyledGainMessage>
                        ) : (
                            ''
                        )}
                    </>
                );
            })}
            <StyledNextRoundButton onClick={handleNextRoundClick}>
                Next round
            </StyledNextRoundButton>
        </StyledEndGameForm>
    );
}
export default EndGameForm;
