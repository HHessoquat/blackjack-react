import { Routes, Route } from 'react-router-dom';
import Playground from './Playground';
import Error from './Error';
import Home from './Home';
import Header from '../Components/Header';
import StyledGlobalStyle from '../utils/styles/GlobalStyle';
import { ThemeProvider } from '../utils/context';
import {
    PlayerNameProvider,
    NbPlayerProvider,
    PlayersProvider,
    BetsProvider,
    HandProvider,
} from '../utils/context';
import { DeckProvider } from '../utils/context/DeckContext';

const App = () => {
    return (
        <>
            <ThemeProvider>
                <NbPlayerProvider>
                    <PlayerNameProvider>
                        <PlayersProvider>
                            <BetsProvider>
                                <DeckProvider>
                                    <HandProvider>
                                        <StyledGlobalStyle />
                                        <Header />
                                        <Routes>
                                            <Route
                                                path="/"
                                                element={<Home />}
                                            />
                                            <Route
                                                path="/playground"
                                                element={<Playground />}
                                            />
                                            <Route
                                                path="*"
                                                element={<Error />}
                                            />
                                        </Routes>
                                    </HandProvider>
                                </DeckProvider>
                            </BetsProvider>
                        </PlayersProvider>
                    </PlayerNameProvider>
                </NbPlayerProvider>
            </ThemeProvider>
        </>
    );
};

export default App;
