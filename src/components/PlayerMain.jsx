import React, { PropTypes} from 'react';
import { connect } from 'react-redux';

import SC from 'soundcloud';
import SoundCloudAudio from 'soundcloud-audio';

import { PlayerBackgroundImage } from './PlayerBackgroundImage';
import PlayerControls from './PlayerControls';
import PlayerAnalyzer from './PlayerAnalyzer';

import {
  loadTracks,
  startTimer,
  setPlayerControl,
  setAudioPlayer,
  setMouseVector,
  PLAYER_CTRL_NEXT,
  PLAYER_NEXT_SPEED,
} from '../actions/';

const mapStateToProps = (state) => {
  return {
    mouseVector: state.stateReducer.mouseVector,
  };
}

class PlayerMain extends React.Component {
  constructor(props) {
    super(props);
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
        <div className='player-sc-main'>
          <PlayerBackgroundImage
            width={window.innerWidth}
            height={window.innerHeight}
            dispatch={this.props.dispatch}
            imageURL={this.props.imageURL}
            //mouseVector={this.props.mouseVector}
            //audioElement={this.state.audioElement}
          />
          <PlayerAnalyzer
            width={window.innerWidth}
            height={window.innerHeight}
          />
          <div className='player-sc-controls-container'>
            <PlayerControls/>
          </div>
        </div>
        <div className='player-sc-footer'>
          <img className="soundcloud-link"
               onClick={(evt) => this.handleOnClick(evt)}
               alt='Fantarka'
               src='https://w.soundcloud.com/icon/assets/images/orange_transparent_56-94fc761.png'/>
        </div>
      </div>
    );
  }

  // handleOnMove(evt) {
  //   this.props.dispatch(setMouseVector({x: evt.clientX, y: evt.clientY}));
  // }

  handleOnClick(evt) {
    window.open(this.props.soundCloudArtistUrl, '_blank');
  }
};

PlayerMain.propTypes = {
  soundCloudClient: PropTypes.string.isRequired,
  soundCloudUserId: PropTypes.string.isRequired,
  soundCloudArtistUrl: PropTypes.string.isRequired,
  imageURL: PropTypes.string.isRequired,
}

export default connect(mapStateToProps)(PlayerMain);