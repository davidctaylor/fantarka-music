import {
  PLAYER_EVENT_INIT,
  PLAYER_EVENT_LOAD,
  PLAYER_EVENT_PROGRESS,
  PLAYER_CTRL,
  PLAYER_CTRL_PLAY,
  PLAYER_CTRL_PAUSE,
  PLAYER_CTRL_NEXT,
  PLAYER_CTRL_PREVIOUS,
  PLAYER_STATE,
  PLAYER_STATE_ACTIVE,
  PLAYER_STATE_IDLE
} from '../actions/';

const initialState = {
  action: PLAYER_STATE,
  playerState: PLAYER_STATE_IDLE,
  trackActive: 0,
  playerTracks: [],
  trackProgress: 0,
  player: null,
};

const handlePlayerEvent = (state, action) => {
  switch(action.type) {

  case PLAYER_EVENT_INIT:
    return {
      ...state,
      action: action.type,
      player: action.payload.player
    };

  case PLAYER_EVENT_LOAD:
    return {
      ...state,
      action: action.type,
      playerTracks: [...action.payload.tracks]
    };

  case PLAYER_EVENT_PROGRESS:
    return {
      ...state,
      action: action.type,
      trackProgress: action.payload.progress
    };

  default:
    return state;
  }
}

const handlePlayerControls = (state, action) => {
  let trackActive = state.trackActive,
    playerState = state.playerState;

  switch (action.payload) {
  case PLAYER_CTRL_PLAY:
    playerState = PLAYER_STATE_ACTIVE;
    break;

  case PLAYER_CTRL_PAUSE:
    playerState = PLAYER_STATE_IDLE;
    break;

  case PLAYER_CTRL_NEXT:
    trackActive = (state.trackActive < state.playerTracks.length - 1 ?
      state.trackActive += 1 : 0);
    break;

  case PLAYER_CTRL_PREVIOUS:
    trackActive = (state.trackActive === 0 ?
      state.playerTracks.length -1 : state.trackActive -= 1);
    break;
  }

  return {
    ...state,
    action: action.type,
    trackActive: trackActive,
    playerState: playerState
  }
}

const playerReducer = (state = initialState, action) => {
  switch (action.type) {
  case PLAYER_EVENT_INIT:
  case PLAYER_EVENT_LOAD:
  case PLAYER_EVENT_PROGRESS:
    return handlePlayerEvent(state, action);

  case PLAYER_STATE:
    return {
      ...state,
      action: action.type,
      playerState: action.payload
    };

  case PLAYER_CTRL:
    return handlePlayerControls(state, action);

  default:
    return state;
  }
};

export default playerReducer;
