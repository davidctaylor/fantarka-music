import React from 'react'
import ReactDOM from 'react-dom';
import Main from './components/Main';

const SOUNDCLOUD_CLIENT = '904ef8653a4252c494b98c310300b467';
//const FANTARKA_SECRET = '578b9b29f07344fc61207d551082dd72';
const SOUNDCLOUD_USER_ID = '81132380';
const x = <Main
  soundCloudClient='904ef8653a4252c494b98c310300b467'
  soundCloudUserId='81132380'
  soundCloudArtistUrl='https://soundcloud.com/fantarka'
  imageURL='./avatars-000076817899-7gz26i-t500x500.jpg'
/>;

ReactDOM.render(x,
  document.getElementById('player-sc-container')
);