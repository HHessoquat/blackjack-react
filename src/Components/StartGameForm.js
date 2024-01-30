import styled from 'styled-components';
import colors from '../utils/styles/colors';
import { useContext, useEffect } from 'react';
import {
    ThemeContext,
    PlayerNameContext,
    nbPlayerContext,
    BetsContext,
    PlayersContext,
    HandContext,
} from '../utils/context';
import { Link } from 'react-router-dom';

const StyledStartGameForm = styled.div`
    margin: auto;
    width: 400px;
    border: 3px solid ${({ colorMode }) => colors[colorMode].boxBorder};
    text-align: center;
    background-color: ${({ colorMode }) => colors[colorMode].form};
    border-radius: 6px;
    margin-top: 50px;
`;
const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    min-height: 200px;
    margin-bottom: 20px;
    margin-top: 20px;
`;
const StyledTextInput = styled.input`
    margin-bottom: 20px;
    margin-top: 8px;
    text-align: center;
    border: 3px solid ${({ colorMode }) => colors[colorMode].boxBorder};
`;
const StyledNameField = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100px;
`;

function StartGameForm() {
    const { setBets } = useContext(BetsContext);
    const { resetActivePlayer } = useContext(PlayersContext);
    const { resetHands } = useContext(HandContext);
    useEffect(() => {
        sessionStorage.clear();
        resetActivePlayer();
        resetHands();
        setBets([[0], [0], [0], [0]]);
    }, []);
    const { theme } = useContext(ThemeContext);

    let { playersName, setPlayersName } = useContext(PlayerNameContext);
    let { nbPlayer, setNbPlayer } = useContext(nbPlayerContext);
    function saveNames() {
        let namesToSave = JSON.stringify(playersName);
        sessionStorage.setItem('playersNames', namesToSave);
    }
    function saveNbPlayer() {
        nbPlayer = JSON.stringify(nbPlayer);
        sessionStorage.setItem('nbPlayer', JSON.stringify(nbPlayer));
    }

    function setNameForms(nbPlayer) {
        let arrayToBeMapped = [];
        for (let i = 0; i < nbPlayer; i++) {
            arrayToBeMapped[i] = i;
        }
        return arrayToBeMapped;
    }

    const prepareNameForm = setNameForms(nbPlayer);

    function updateNames(newName, index) {
        const updatedName = playersName.map((c, i) => {
            if (index === i) {
                return newName;
            } else return c;
        });
        setPlayersName(updatedName);
    }

    return (
        <StyledStartGameForm colorMode={theme}>
            <p>
                Bonjour, <br />
                Une table pour combien?
            </p>
            <StyledForm>
                <div>
                    <input
                        onClick={() => setNbPlayer(1)}
                        type="radio"
                        id="1"
                        name="nbPlayer"
                        value="1"
                        defaultChecked
                    />
                    <label htmlFor="1">1</label>
                    <input
                        onClick={() => setNbPlayer(2)}
                        type="radio"
                        id="2"
                        name="nbPlayer"
                        value="2"
                    />
                    <label htmlFor="2">2</label>
                    <input
                        onClick={() => setNbPlayer(3)}
                        type="radio"
                        id="3"
                        name="nbPlayer"
                        value="3"
                    />
                    <label htmlFor="3">3</label>
                    <input
                        onClick={() => setNbPlayer(4)}
                        type="radio"
                        id="4"
                        name="nbPlayer"
                        value="4"
                    />
                    <label htmlFor="4">4</label>
                </div>

                <StyledNameField>
                    {prepareNameForm.map((c, index) => (
                        <div key={index}>
                            <p> Nom du joueur {index + 1} </p>
                            <StyledTextInput
                                colorMode={theme}
                                type="text"
                                value={playersName[index]}
                                onChange={(e) =>
                                    updateNames(e.target.value, index)
                                }
                            />
                        </div>
                    ))}
                </StyledNameField>
                <Link to="/playground">
                    <button
                        onClick={() => {
                            saveNames();
                            saveNbPlayer();
                        }}
                    >
                        Go
                    </button>
                </Link>
            </StyledForm>
        </StyledStartGameForm>
    );
}
export default StartGameForm;
