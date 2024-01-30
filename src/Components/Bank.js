import BankHand from './BankHand';

function Bank({ betSequence, endRound }) {
    return (
        <>
            {!betSequence.current && (
                <BankHand isActive={true} endRound={endRound} />
            )}
        </>
    );
}
export default Bank;
