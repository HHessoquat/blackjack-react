import styled from 'styled-components';
import { useContext } from 'react';
import { BetsContext } from '../utils/context';

const StyledBetInfo = styled.div`
    border: solid 2px white;
    height: 50px;
    width: 50px;
`;

function BetInfo() {
    const { sumBets } = useContext(BetsContext);

    return <StyledBetInfo>{sumBets}</StyledBetInfo>;
}
export default BetInfo;
