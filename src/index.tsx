import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Player from './components/player/player';
import store from './store/store';

import './index.scss';

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Player />
    </Provider>,
    document.getElementById('root')
  )
}

render();

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./components/player/player', render)
}
