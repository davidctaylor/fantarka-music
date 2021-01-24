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

import { TrackList } from 'components/list/track-list';
import { RootState } from 'store/root-reducer';
import {
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
  playerControls,
} from './player-slice';
import './player.scss';

const SOUNDCLOUD_CLIENT = '904ef8653a4252c494b98c310300b467';
//const FANTARKA_SECRET = '578b9b29f07344fc61207d551082dd72';
const SOUNDCLOUD_USER_ID = '81132380';

const Player: React.FC = () => {
  const dispatch = useDispatch();
  const isLoaded: boolean = useSelector((state: RootState) => state.player.tracksLoaded);
  const isBackgroundLoaded: boolean = useSelector((state: RootState) => state.player.backgroundLoaded);
  const activeAudioState: AudioStateType | null = useSelector((state: RootState) => state.player.audioState);
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
    if (activeAudioState === 'stopped' && isBackgroundLoaded) {
      const timer = setInterval(() => dispatch(playerControls('next' as PlayerControlType)), 5000);
      return () => clearInterval(timer);
    }
    }, [dispatch, activeAudioState, isBackgroundLoaded]);

  useScrollPosition(['scroll'], setScrollPosition);

  const containerStyle: CSSProperties = {
    transform: `scale(${Math.max(0, 1 - (scrollPosition.y / 500))})`,
  };

  return <div className="player-container">
    <div className="container-sticky-content" style={containerStyle}>
      <PlayerBackground width={window.innerWidth} height={window.innerHeight} url={'./fantarka-avatar.jpg'}/>

      <div className="content-header">Fantarka</div>
      <div className="content-main">
        <PlayerControls clientId={SOUNDCLOUD_CLIENT}/>
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
