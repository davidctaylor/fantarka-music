import React, {
  CSSProperties,
  useEffect,
  useState
} from 'react'
import {
  useDispatch,
  useSelector
} from 'react-redux'

import SC from 'soundcloud';
import SoundCloudAudio from 'soundcloud-audio';

import { TrackList } from 'components/list/track-list';
import { RootState } from 'store/root-reducer';
import {
  Track,
  PlayerControlType,
  ScrollPosition,
  AudioStateType
} from 'interfaces/index';
import { useScrollPosition } from 'components/effects/scroll';
import { PlayerBackground } from 'components/background/player-background';
import { PlayerControls } from 'components/controls/player-controls';
import { PlayerTrackName } from 'components/player-track-name/player-track-name';
import { SocialBar } from 'components/social-bar/social-bar';

import {
  fetchTracks,
  trackProgress,
  audioPlayPlayTrack,
  playerControls,
} from './player-slice';
import './player.scss';

const SOUNDCLOUD_CLIENT = '904ef8653a4252c494b98c310300b467';
//const FANTARKA_SECRET = '578b9b29f07344fc61207d551082dd72';
const SOUNDCLOUD_USER_ID = '81132380';

const useSoundCloudPlayer = (): {player: any, ctx: any} => {
  const dispatch = useDispatch();
  const [player, setPlayer] = useState<{player: any, ctx: any}>({player: null, ctx: null});
  if (!player.player) {
    console.log('XXX INIT PLAYER...');
    // @ts-ignore
    // window.AudioContext = window.AudioContext || window.webkitAudioContext || null;
    // // @ts-ignore
    // if (!window.AudioContext) {
    //   throw new Error(
    //     'Could not find AudioContext. This may be because your browser does not support Web Audio.');
    // }

    const player: {player: any, ctx: any} = { player: new SoundCloudAudio(SOUNDCLOUD_CLIENT), ctx: null}; // new AudioContext()};
    let last: number = -1;

    player.player.audio.crossOrigin = 'anonymous';
    player.player.on('timeupdate', (time: number) => {
      const progress: number = (player.player.audio.currentTime / player.player.audio.duration) * 100;
      if (progress !== last) {
        dispatch(trackProgress((player.player.audio.currentTime / player.player.audio.duration) * 100 || 0));
        last = progress;
      }
    });
    setPlayer(player);
  }

  return player;
};

const Player: React.FC = () => {
  const isLoaded: boolean = useSelector((state: RootState) => state.player.tracksLoaded);
  const tracks: Track[] = useSelector((state: RootState) => state.player.tracks);
  const trackActive: number = useSelector((state: RootState) => state.player.trackActive);
  const activeAudioState: AudioStateType | null = useSelector((state: RootState) => state.player.audioState);
  const controlAction: PlayerControlType = useSelector((state: RootState) => state.player.controlAction);
  const dispatch = useDispatch();
  const player: {player: any, ctx: any} = useSoundCloudPlayer();
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({x: 0, y: 0, w: 0, h: 0});


  SC.initialize({
    client_id: SOUNDCLOUD_CLIENT
  });

  useEffect(() => {
    if (!isLoaded) {
      dispatch(fetchTracks(SOUNDCLOUD_USER_ID, SOUNDCLOUD_CLIENT));
    }
  }, [dispatch, isLoaded]);

  useEffect(() => {
    if (controlAction && controlAction !== 'idle') {
      switch(controlAction) {
        case 'previous':
        case 'next':
          if (activeAudioState !== 'stopped') {
            dispatch(audioPlayPlayTrack(player, tracks[trackActive].stream_url));
          }
          break;
        case 'play':
          dispatch(audioPlayPlayTrack(player, tracks[trackActive].stream_url));
          break;
        case 'pause':
          dispatch(audioPlayPlayTrack(player));
      }
    }
  }, [dispatch, controlAction, player, tracks, trackActive, activeAudioState]);

  useEffect(
    () => {
      if (activeAudioState === 'stopped') {
        const timer = setInterval(() => dispatch(playerControls('next' as PlayerControlType)), 5000);
        return () => clearInterval(timer);
      }
    },
    [dispatch, activeAudioState]
  );

  useScrollPosition(['scroll'], setScrollPosition);

  const containerStyle: CSSProperties = {
    transform: `scale(${Math.max(0, 1 - (scrollPosition.y / 500))})`,
  };

  return <div className="player-container">
    {/*<div>Hello<button>CLICK...</button></div>*/}
    {/*<audio src='https://api.soundcloud.com/tracks/711425299/stream?client_id=904ef8653a4252c494b98c310300b467'*/}
    {/*       controls autoPlay/>*/}

    <div className="container-sticky-content" style={containerStyle}>
      <PlayerBackground width={window.innerWidth} height={window.innerHeight} url={'./fantarka-avatar.jpg'}/>
      <div className="content-header">Fantarka</div>
      <div className="content-main">
        <PlayerControls />
        <PlayerTrackName />
        <div className="container-indicator">
          <div className="indicator-line"></div>
          <div className="indicator-sphere"></div>
        </div>
      </div>
      {/*<div className="content-footer">*/}
      {/*  <div style={{width: '10px', borderWidth: '2px', borderRightColor: 'green', height: '20px'}}></div>*/}
      {/*</div>*/}
    </div>

    <TrackList onClick={(e) => console.log('XXX CLICKED')}/>
    <SocialBar/>
  </div>
}

export default Player
