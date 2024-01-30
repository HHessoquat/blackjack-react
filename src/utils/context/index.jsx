import React, { useState, createContext, useEffect, useRef } from 'react';
import { useContext } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // localStorage.removeItem('savedTheme');
    const savedTheme = () =>
        localStorage.getItem('savedTheme') === null
            ? JSON.stringify(0)
            : localStorage.getItem('savedTheme');
    let isSaved = savedTheme();
    isSaved = JSON.parse(isSaved);

    let [theme, setTheme] = useState(isSaved);
    const toggleTheme = () => {
        if (theme <= 2) {
            theme = theme + 1;
        } else {
            theme = 0;
        }

        setTheme(theme);
        localStorage.setItem('savedTheme', JSON.stringify(theme));
    };
    const toggleDarkTheme = () => {
        if (theme >= 4 && theme < 8) {
            theme = theme + 1;
        } else {
            theme = 4;
        }
        setTheme(theme);
        localStorage.setItem('savedTheme', JSON.stringify(theme));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, toggleDarkTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const PlayerNameContext = createContext();
export const PlayerNameProvider = ({ children }) => {
    let [playersName, setPlayersName] = useState([
        'Anonymous Player',
        'unkownPlayer',
        'unnamed Player',
        'player with no name',
    ]);
    // sessionStorage.removeItem('playersName');
    if (sessionStorage.getItem('playersName') !== null) {
        playersName = sessionStorage.getItem('playersName');
        playersName = JSON.parse(playersName);
    }
    return (
        <PlayerNameContext.Provider value={{ playersName, setPlayersName }}>
            {children}
        </PlayerNameContext.Provider>
    );
};

export const nbPlayerContext = createContext();
export const NbPlayerProvider = ({ children }) => {
    let [nbPlayer, setNbPlayer] = useState(1);
    // sessionStorage.removeItem('nbPlayer')
    if (sessionStorage.getItem('nbPlayer') !== null) {
        nbPlayer = JSON.parse(sessionStorage.getItem('nbPlayer'));
    }
    return (
        <nbPlayerContext.Provider value={{ nbPlayer, setNbPlayer }}>
            {children}
        </nbPlayerContext.Provider>
    );
};

export const PlayersContext = createContext();
export const PlayersProvider = ({ children }) => {
    const [players, setPlayers] = useState([
        {
            id: 1,
            playersName: 'unexistant Player',
            money: 74,
            blackjack: false,
            canBet: true,
            mainBet: 0,
            insurance: 0,
        },
    ]);
    const [activePlayer, setActivePlayer] = useState(1);
    function skipPlayer(nbPlayer) {
        if (activePlayer !== 0) {
            players[activePlayer - 1].initialBet === 0 &&
                switchActivePlayer(nbPlayer);
        }
    }
    function switchActivePlayer(nbPlayer) {
        activePlayer >= nbPlayer
            ? setActivePlayer(0)
            : setActivePlayer(activePlayer + 1);
    }

    function resetActivePlayer() {
        setActivePlayer(1);
    }

    return (
        <PlayersContext.Provider
            value={{
                players,
                setPlayers,
                activePlayer,
                switchActivePlayer,
                resetActivePlayer,
                skipPlayer,
            }}
        >
            {children}
        </PlayersContext.Provider>
    );
};
export const BetsContext = createContext();
export const BetsProvider = ({ children }) => {
    const [bets, setBets] = useState([[0], [0], [0], [0]]);
    useEffect(() => {
        console.log('passe betProvider effect');
        if (sessionStorage.getItem('bets') != null) {
            setBets(JSON.parse(sessionStorage.getItem('bets')));
        }
    }, []);
    const sumBets = bets.reduce((total, current) => {
        const sumCurrent = current.reduce((t, c) => t + c, 0);
        return total + sumCurrent;
    }, 0);
    function resetBets() {
        setBets([[0], [0], [0], [0]]);
    }

    return (
        <BetsContext.Provider value={{ bets, setBets, sumBets, resetBets }}>
            {children}
        </BetsContext.Provider>
    );
};
export const HandContext = createContext();
export const HandProvider = ({ children }) => {
    const [hands, setHands] = useState([], [], [], [], []);
    console.log('passeici');
    useEffect(() => {
        console.log('check handcontext effect');
        if (sessionStorage.getItem('hands') !== null) {
            console.log('passe hand retriever');
            const retrievedHands = JSON.parse(sessionStorage.getItem('hands'));
            setHands(JSON.parse(retrievedHands));
        }
    }, [window.location.reload]);
    const [activeHand, setActiveHand] = useState(0);
    function switchActiveHand(nbHand) {
        if (activeHand >= nbHand) {
            setActiveHand(0);
        } else {
            setActiveHand(activeHand + 1);
        }
    }
    function resetHands() {
        setHands([[], [], [], [], []]);
        sessionStorage.removeItem('hands');
    }

    // const couldBe = {
    //     handId: 'hand' + player.id,
    //     cards: [],
    //     isLost: false,
    //     hasBlackJack: false,
    //     hasAceWorth11: false,
    // };
    const scores = useRef([[0], [0], [0], [0], [0]]);
    function resetScores() {
        scores.current = [[0], [0], [0], [0], [0]];
    }
    return (
        <HandContext.Provider
            value={{
                hands,
                setHands,
                resetHands,
                activeHand,
                setActiveHand,
                switchActiveHand,
                scores,
                resetScores,
            }}
        >
            {children}
        </HandContext.Provider>
    );
};
