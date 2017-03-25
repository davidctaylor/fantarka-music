import React from 'react';
import { connect } from 'react-redux';

import SC from 'soundcloud';
import SoundCloudAudio from 'soundcloud-audio';

import { PlayerBackgroundImage } from './PlayerBackgroundImage';
import PlayerControls from './PlayerControls';
import { SocialBar } from './SocialBar';
import { About } from './About';
import { AboutIcon } from './PlayerControlIcons';

import {
  loadTracks,
  startTimer,
  setPlayerControl,
  setAudioPlayer,
  setMouseVector,
  setAboutActive,
  PLAYER_CTRL_NEXT,
  PLAYER_NEXT_SPEED,
} from '../actions/';

const mapStateToProps = (state) => {
  return {
    mouseVector: state.stateReducer.mouseVector,
    aboutActive: state.stateReducer.aboutActive,
  };
}

class PlayerMain extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnClick = (...evt) => this.handleOnClickEvent(...evt);
  }

  componentDidMount() {
    SC.initialize({
      client_id: this.props.soundCloudClient
    });

    this.props.dispatch(setAudioPlayer(new SoundCloudAudio(this.props.soundCloudClient)));

    setTimeout(() => {
      SC.get('/tracks', {
        user_id: this.props.soundCloudUserId,
        limit: 100
      }).then(
        tracks => this.props.dispatch(loadTracks(tracks),
          err => console.log('XXX E:', err))
      );

      this.props.dispatch(startTimer(setPlayerControl(PLAYER_CTRL_NEXT), PLAYER_NEXT_SPEED));

    }, 2000);
  }

  render() {
    return (
      <div className='player-sc-components'
        //onMouseMove={(evt) => this.handleOnMove(evt)}
      >
        <div className='player-sc-header'>Fantarka</div>
        <About handleOnClick={this.handleOnClick}
               aboutActive={this.props.aboutActive}
        />
        <div className='player-sc-main'>
          <PlayerBackgroundImage
            width={window.innerWidth}
            height={window.innerHeight}
            dispatch={this.props.dispatch}
            imageURL={this.props.imageURL}
            //mouseVector={this.props.mouseVector}
            //audioElement={this.state.audioElement}
          />
          <div className={`player-sc-controls-container ${this.props.aboutActive ? 'hidden' : 'visible'}`}>
            <PlayerControls/>
          </div>
        </div>
        <div className='player-sc-footer'>
            <AboutIcon width={32}
                       handleOnClick={this.handleOnClick}/>
            <SocialBar imageURL={this.props.imageURL}
                       handleOnClick={this.handleOnClick}
            />
        </div>
      </div>
    );
  }

  // handleOnMove(evt) {
  //   this.props.dispatch(setMouseVector({x: evt.clientX, y: evt.clientY}));
  // }

  handleOnClickEvent(evt, type) {
    switch (type) {
    case 'about':
      this.props.dispatch(setAboutActive());
      return;
    case 'soundCloud':
      window.open(this.props.soundCloudArtistUrl, '_blank');
      return;
    case 'openMail':
      window.location.href = "mailto:fantarkamusic@gmail.com";
      //window.open('mailto:fantarkamusic@gmail.com', '_blank');
      return;
    }
  }
};

PlayerMain.propTypes = {
  soundCloudClient: React.PropTypes.string.isRequired,
  soundCloudUserId: React.PropTypes.string.isRequired,
  soundCloudArtistUrl: React.PropTypes.string.isRequired,
  imageURL: React.PropTypes.string.isRequired,
}

export default connect(mapStateToProps)(PlayerMain);