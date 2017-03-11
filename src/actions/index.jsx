export const
  MOUSE_VECTOR = Symbol('MouseVector'),
  TIMER_START = Symbol('timerStart'),
  TIMER_STOP = Symbol('timerStop');

export const
  PLAYER_EVENT_INIT = Symbol('PlayerEventInit'),
  PLAYER_EVENT_LOAD = Symbol('PlayerEventLoad'),
  PLAYER_EVENT_PROGRESS = Symbol('PlayerEventProgress'),
  PLAYER_STATE = Symbol('PlayerState'),
  PLAYER_CTRL = Symbol('PlayerControl');

export const
  PLAYER_CTRL_PLAY = Symbol('PlayerControlPlay'),
  PLAYER_CTRL_PAUSE = Symbol('PlayerControlPause'),
  PLAYER_CTRL_NEXT = Symbol('PlayerControlNext'),
  PLAYER_CTRL_PREVIOUS = Symbol('PlayerControlPrevious'),
  PLAYER_STATE_ACTIVE = Symbol('PlayerStateActive'),
  PLAYER_STATE_IDLE = Symbol('PlayerStateIdle');

export const PLAYER_NEXT_SPEED = 6000;

export const setMouseVector = (v) => {
  return {
    type: MOUSE_VECTOR,
    payload: v
  }
};


export const setPlayerControl = (c) => {
  return {
    type: PLAYER_CTRL,
    payload: c
  }
};

export const loadTracks = (tracks) => {
  return {
    type: PLAYER_EVENT_LOAD,
    payload: {
      tracks: tracks.map(track => {
        return {
          title: track.title,
          streamUrl: track.stream_url,
          id: track.id,
          progress: 0,
          isPlaying: false
        };
      })
    }
  }
};

export const setPlayerState = (playerState) => {
  return (dispatch, getState) => {
    const {playerReducer} = getState();

    if (playerReducer.player && playerReducer.playerTracks.length > 0) {
      dispatch({type: PLAYER_STATE, payload: playerState});

      if (playerState === PLAYER_STATE_ACTIVE) {
          playerReducer.player.play({streamUrl: playerReducer.playerTracks[playerReducer.trackActive].streamUrl});
      } else {
        //playerReducer.player.stop();
        playerReducer.player.pause();
      }
    };
  }
};

export const setAudioPlayer = (player) => {
  return (dispatch, getState) => {
    const {playerReducer} = getState();

    if (!playerReducer.player) {
      player.audio.crossOrigin = 'anonymous';

      dispatch({
        type: PLAYER_EVENT_INIT, payload: {
          player: player
        }
      });

      player.on('timeupdate', (time) => {
          dispatch({
            type: PLAYER_EVENT_PROGRESS,
            payload: {
              progress: ((player.audio.currentTime / player.audio.duration) * 100 || 0)
            }
          })
        });
    }
  }
}

export function startTimer(action, interval) {
  return (dispatch, getState) => {
    const {stateReducer} = getState(),
      timers = stateReducer.timers;

    if (!timers[action]) {
      const id = setInterval(() => dispatch({type: action.type, payload: action.payload}), interval ? interval : 4000);

      dispatch({type: TIMER_START, payload: {action: action, timerId: id}});
    }
  }
}

export function stopTimer(action) {
  return (dispatch, getState) => {
    const {stateReducer} = getState(),
      timers = stateReducer.timers;

    if (timers[action]) {
      clearInterval(timers[action].timerId);
      dispatch({type: TIMER_STOP, payload: {action: action}});
    }
  }
}
