import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useContext } from 'react';
import { ThemeContext } from '../utils/context';
import colors from '../utils/styles/colors';

const StyledHeader = styled.div`
    border-bottom: solid 2px ${({ colorMode }) => colors[colorMode].boxBorder};
    padding-bottom: 10px;
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-left: 150px;
    margin-right: 150px;
    margin-bottom: 60px;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    &:hover {
        cursor: pointer;
        color: #777777;
    }
    &:visited {
        color: white;
    }
`;
const ShiftModeButton = styled.button`
    width: 100px;
    height: 20px;
`;
function Header() {
    const { toggleTheme } = useContext(ThemeContext);
    const { toggleDarkTheme } = useContext(ThemeContext);
    const { theme } = useContext(ThemeContext);
    return (
        <StyledHeader className="header" colorMode={theme}>
            <StyledLink to="/">Accueil</StyledLink>
            <StyledLink to="/playground">Playground</StyledLink>
            <ShiftModeButton onClick={() => toggleTheme()}>
                Switch Theme
            </ShiftModeButton>
            <ShiftModeButton onClick={() => toggleDarkTheme()}>
                Dark Modes
            </ShiftModeButton>
        </StyledHeader>
    );
}
export default Header;
