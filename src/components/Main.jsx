import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';

import PlayerMain from './PlayerMain';

import syncopate from '../fonts/syncopate.scss';
import style from '../../stylesheets/sound-player.scss';

const store = configureStore();

const SOUNDCLOUD_CLIENT = '904ef8653a4252c494b98c310300b467';
const FANTARKA_SECRET = '578b9b29f07344fc61207d551082dd72';

const SOUNDCLOUD_USER_ID = '81132380';

export default class Main extends Component {
  render() {
    return (
      <Provider store={store}>
        <PlayerMain
          soundCloudClient={SOUNDCLOUD_CLIENT}
          soundCloudUserId={SOUNDCLOUD_USER_ID}
          soundCloudArtistUrl='https://soundcloud.com/fantarka'
          imageURL='/avatars-000076817899-7gz26i-t500x500.jpg'
        />
      </Provider>
    )
  }
}

