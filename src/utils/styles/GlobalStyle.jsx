import { useContext } from 'react';
import { createGlobalStyle } from 'styled-components';
import { ThemeContext } from '../context';
import colors from './colors';

const StyledGlobalStyle = createGlobalStyle`
body {
    background-color: ${({ colorMode }) => colors[colorMode].primary};
    margin: 0;
    color: ${({ colorMode }) => colors[colorMode].white};
    font-family: tahoma;
}
button {
    border: none;
    border-radius: 5px;
    box-shadow: 2px 4px 2px ${({ colorMode }) => colors[colorMode].shadows};
    color: white;
    background-color: ${({ colorMode }) => colors[colorMode].button};
    cursor: pointer;
}
p {
    margin: 0;
}`;

function GlobalStyle() {
    const { theme } = useContext(ThemeContext);
    return <StyledGlobalStyle colorMode={theme} />;
}
export default GlobalStyle;
