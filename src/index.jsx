import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';

import PlayerMain from './components/PlayerMain';

//import syncopate from '../fonts/syncopate.scss';
import style from '../stylesheets/main.scss';

const SOUNDCLOUD_CLIENT = '904ef8653a4252c494b98c310300b467';
//const FANTARKA_SECRET = '578b9b29f07344fc61207d551082dd72';
const SOUNDCLOUD_USER_ID = '81132380';
const SOUNDCLOUD_ARTIST_URL = 'https://soundcloud.com/fantarka';
const IMAGE_URL = './images/avatars-000076817899-7gz26i-t500x500.jpg';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <PlayerMain
      soundCloudClient={SOUNDCLOUD_CLIENT}
      soundCloudUserId={SOUNDCLOUD_USER_ID}
      soundCloudArtistUrl={SOUNDCLOUD_ARTIST_URL}
      imageURL={IMAGE_URL}
    />
  </Provider>,
  document.getElementById('player-sc-container')
);