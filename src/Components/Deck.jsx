import styled from 'styled-components';
import { useContext } from 'react';
import { ThemeContext } from '../utils/context';
import colors from '../utils/styles/colors';
import { DeckContext } from '../utils/context/DeckContext';

const StyledDeck = styled.img`
    background-color: #bbbbbb;
    border-radius: 10px;
    height: 200px;
    cursor: pointer;
    border: solid 6px ${({ colorMode }) => colors[colorMode].cardBorder};
`;
function Deck() {
    const { theme } = useContext(ThemeContext);
    const { card, getCardAndMoveCursor } = useContext(DeckContext);

    return (
        <>
            <StyledDeck
                onClick={() => getCardAndMoveCursor()}
                colorMode={theme}
                src="./images/backs/blue.svg"
                alt={card.name}
            />
            <p>{card.value}</p>
        </>
    );
}
export default Deck;
