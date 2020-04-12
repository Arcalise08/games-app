import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import NavMenu from './components/nav-menu/nav-menu';

import MainViewer from './components/main-view/main-view';
import gamesApp from './reducers/reducers';

import './index.scss';

const store = createStore(gamesApp);

class OPgamesApp extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <MainViewer/>
                </Router>
            </Provider>
        );
    }
}



const container = document.getElementsByClassName('app-container')[0];

ReactDOM.render(React.createElement(OPgamesApp), container);