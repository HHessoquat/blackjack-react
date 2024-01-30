import styled from 'styled-components';
import Cards from '../Assets/Cards';
import colors from '../utils/styles/colors';
import { useContext } from 'react';
import { ThemeContext } from '../utils/context';

const StyledDecorativeBlackjack = styled.div`
    border: solid 2px white;
    height: 50px;
    width: 50px;
    display: flex;
    flex-direction: row;
`;
const StyledImage = styled.img`
    background-color: white;
    border-radius: 10px;
    height: 200px;
    border: solid 6px ${({ colorMode }) => colors[colorMode].cardBorder};
`;
const StyledKing = styled.img`
    background-color: white;
    border-radius: 10px;
    height: 200px;
    border: solid 6px ${({ colorMode }) => colors[colorMode].cardBorder};
    margin-left: -100px;
`;
function DecorativeBlackjack() {
    const { theme } = useContext(ThemeContext);
    const as = Cards[0];
    const king = Cards[27];
    return (
        <StyledDecorativeBlackjack>
            <StyledImage src={as.imgPath} alt={as.name} colorMode={theme} />
            <StyledKing src={king.imgPath} alt={king.name} colorMode={theme} />
        </StyledDecorativeBlackjack>
    );
}

export default DecorativeBlackjack;
