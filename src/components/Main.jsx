import React, {Component} from 'react';
import {Provider} from 'react-redux';
import configureStore from '../store/configureStore';

import PlayerMain from './PlayerMain';

//import syncopate from '../fonts/syncopate.scss';
import style from '../../stylesheets/fantarka.scss';

const store = configureStore();

const Main = (props) => (
  <Provider store={store}>
    <PlayerMain
      soundCloudClient={props.soundCloudClient}
      soundCloudUserId={props.soundCloudUserId}
      soundCloudArtistUrl={props.soundCloudArtistUrl}
      imageURL={props.imageURL}
    />
  </Provider>
);

export default Main;


