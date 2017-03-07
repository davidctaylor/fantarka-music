import React, { PropTypes} from 'react';
import { connect } from 'react-redux';
import { PlayIcon, ProgressControls } from './PlayerControlIcons';
import { TrackDisplay } from './TrackDisplay';

import {
  startTimer,
  stopTimer,
  setPlayerState,
  setPlayerControl,
  PLAYER_STATE_ACTIVE,
  PLAYER_STATE_IDLE,
  PLAYER_CTRL_PLAY,
  PLAYER_CTRL_PAUSE,
  PLAYER_CTRL_NEXT,
  PLAYER_CTRL_PREVIOUS,
  PLAYER_NEXT_SPEED,
} from '../actions';

const mapStateToProps = (state) => {
  return {
    playerAction: state.playerReducer.action,
    playerState: state.playerReducer.playerState,
    trackActive: state.playerReducer.trackActive,
    playerTracks: state.playerReducer.playerTracks,
    trackProgress: state.playerReducer.trackProgress,
  };
}

class PlayerControls extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnClick = (...evt) => this.handleOnClickEvent(...evt);
  }

  render() {
    return (
      <div className='player-sc-controls'>
        <div className='player-sc-play-controls'>
          <div className='player-sc-play-button'>
            <PlayIcon
              playerState={this.props.playerState}
              onClick={this.handleOnClick}
          />
          </div>
          <TrackDisplay
            playerAction={this.props.playerAction}
            playerTracks={this.props.playerTracks}
            playerState={this.props.playerState}
            trackActive={this.props.trackActive}
          />
          <div className='player-sc-track-controls'>
            <ProgressControls
              playerState={this.props.playerState}
              trackProgress={this.props.trackProgress}
              onClick={this.handleOnClick}
            />
          </div>
        </div>
      </div>
    )
  }

  handleOnClickEvent = (e, clickAction) => {
    switch(clickAction) {
    case PLAYER_CTRL_PLAY:
      this.props.dispatch(stopTimer(setPlayerControl(PLAYER_CTRL_NEXT)));
      this.props.dispatch(setPlayerState(PLAYER_STATE_ACTIVE));
      break;

    case PLAYER_CTRL_PAUSE:
      this.props.dispatch(setPlayerState(PLAYER_STATE_IDLE));
      this.props.dispatch(startTimer(setPlayerControl(PLAYER_CTRL_NEXT), PLAYER_NEXT_SPEED));
      break;

    case PLAYER_CTRL_NEXT:
    case PLAYER_CTRL_PREVIOUS:
      this.props.dispatch(setPlayerControl(clickAction));
      if (this.props.playerState === PLAYER_STATE_ACTIVE) {
        this.props.dispatch(setPlayerState(PLAYER_STATE_ACTIVE));
      }
      break;
    }
  }
}

PlayerControls.propTypes = {
}

export default connect(mapStateToProps)(PlayerControls);