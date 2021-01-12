import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import SC from 'soundcloud';

import { AppThunk } from 'store/store'
import { Track, PlayerControlType, AudioStateType } from 'interfaces/index';
let last: string | null = null;

interface PlayerState {
  audioState: AudioStateType;
  controlAction: PlayerControlType;
  error: string | null;
  tracks: Track[];
  tracksLoaded: boolean;
  trackActive: number;
  trackProgress: number;
}

const loadTracks = (userId: string, clientId: string): Promise<Track[]> => {
  return SC.get(`/users/${userId}/tracks/`, {
    client_id: clientId,
    limit: 100
  });
};

const loadTracksFailed = (state: PlayerState, action: PayloadAction<string>) => {
  state.error = action.payload;
};

const playerInitialState: PlayerState = {
  audioState: 'stopped',
  controlAction: 'idle',
  error: null,
  tracks: [],
  tracksLoaded: false,
  trackActive: 0,
  trackProgress: 0,
};

const playerSlice = createSlice({
  name: 'player',
  initialState: playerInitialState,
  reducers: {
    audioState(state: PlayerState, action: PayloadAction<AudioStateType>) {
      state.audioState = action.payload;
    },
    getTracksSuccess(state, { payload }: PayloadAction<Track[]>) {
      state.error = null;
      state.tracks = payload;
      state.tracksLoaded = true;
    },
    getTracksFailure: loadTracksFailed,
    playerControls(state: PlayerState, action: PayloadAction<PlayerControlType>) {
      switch (action.payload) {
        case 'previous':
          state.trackActive = state.trackActive - 1 > -1 ? state.trackActive - 1 : state.tracks.length -1;
          break;
        case 'next':
          state.trackActive = state.tracks.length > state.trackActive + 1 ? state.trackActive + 1  : 0;
          break;
      }
      state.controlAction = action.payload;
    },
    trackActive(state: PlayerState, action: PayloadAction<number>) {
      state.trackActive = action.payload;
    },
    trackProgress(state: PlayerState, action: PayloadAction<number>) {
      state.trackProgress = action.payload;
    }
  }
});

export const {
  getTracksSuccess,
  getTracksFailure,
  audioState,
  playerControls,
  trackActive,
  trackProgress
} = playerSlice.actions;

export default playerSlice.reducer;

export const audioPlayPlayTrack = (player: {player: any, ctx: any}, url?: string): AppThunk => async dispatch => {
  let state: AudioStateType = 'stopped';


  // console.log('XXX PLAYER:', player.ctx);


  if (!url) {
    player.player.pause();
    // player.ctx.suspend();
    last = null;
  } else {
    state = 'playing';

    if (url && last === url) {
      return;
    }
    // if (player.ctx.state === 'suspended') {
    //   player.ctx.resume();
    // }
    console.log('XXX url2:', url);
    last = url;
    player.player
      .play({streamUrl: url}, 'auto')
      .then((v: any) => {
        console.log('XXX PLAYER STARTED...', v);
        state = 'playing';
        return 'playing'
      }, (e: any) => {
        console.log('Player start error', url, e);
        state = 'stopped';
        return 'stopped';
      });
    // state = await player
    //   .play({streamUrl: url})
    //   .then((v: any) => {
    //     console.log('XXX PLAY...', v);
    //     return 'playing'
    //   }, (v: any) => {
    //     console.log('XXX PLAY E...', v);
    //     return 'stopped';
    //   });

  }
  dispatch(audioState(state));
}

export const fetchTracks = (userId: string, clientId: string): AppThunk => async dispatch => {
  try {
    let tracks: Track[] = await loadTracks(userId, clientId);
    tracks = tracks.map((t: Track) => {
      return {
        ...t,
        artwork_url: t.artwork_url ? t.artwork_url.replace('-large', '-t500x500') : null,
      };
    });

    dispatch(getTracksSuccess(tracks));
  } catch (err) {
    dispatch(getTracksFailure(err.toString()))
  }
};
