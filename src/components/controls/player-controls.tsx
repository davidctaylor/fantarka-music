import React from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {
  PlayerControlType,
  AudioStateType,
  Track
} from 'interfaces/index';

import { RootState } from 'store/root-reducer';
import { ControlButton, ControlsType } from 'components/control-button/control-button';
import { PlayerAudio} from 'components/audio/player-audio';
import {
  playerControls,
  trackSeek
} from 'components/player/player-slice';
import './player-controls.scss';

interface PlayerControlsProps {
  clientId: string
}

export const PlayerControls = ({clientId}: PlayerControlsProps) => {
  const dispatch = useDispatch();
  const activeTrackProgress: number = useSelector((state: RootState) => state.player.trackProgress);
  const activeAudioState: AudioStateType | null = useSelector((state: RootState) => state.player.audioState);
  const tracks: Track[] = useSelector((state: RootState) => state.player.tracks);
  const activeTrack: number = useSelector((state: RootState) => state.player.trackActive);
  // const activeSeek: number = useSelector((state: RootState) => state.player.trackSeek);
  // const audioRef: Ref<HTMLAudioElement> = useRef<HTMLAudioElement>(null);
  const controlAction: PlayerControlType = useSelector((state: RootState) => state.player.controlAction);

  const handleOnClickEvent = (t: ControlsType) => {
    let c: PlayerControlType | null = null;
    switch(t) {
      case 'previous':
        c = t;
        break;
      case 'pause':
        c = t;
        break;
      case 'play':
        c = t;
        break;
      case 'next':
        c = t;
        break;
    }
    if (!c) {
      return;
    }
    dispatch(playerControls(c));
  };

  const handleSliderEvent = (p: number) => {
    dispatch(trackSeek(p));
  };

  return <div className='player-controls'>
    <div className='controls-buttons'>
      {/*<audio ref={audioRef} onTimeUpdate={handleTimeUpdate()} crossOrigin={'anonymous'} autoPlay={true}/>*/}
      {/*{controlAction === 'play' &&*/}
      {/*  <PlayerAudio clientId={clientId} streamURL={tracks[activeTrack].stream_url} controlAction={controlAction}/>*/}
      {/*}*/}
      {tracks && tracks.length > 0 && (controlAction !== 'idle') &&
        <PlayerAudio clientId={clientId} streamURL={tracks[activeTrack].stream_url} controlAction={controlAction}/>
      }
      <ControlButton iconType={'previous'} onClick={handleOnClickEvent}/>
      <ControlButton
        iconType={activeAudioState === 'playing' ? 'pause' : 'play'}
        onClick={handleOnClickEvent}/>
      <ControlButton iconType={'next'} onClick={handleOnClickEvent}/>
    </div>
    <div className={`controls-progress ${activeAudioState === 'playing' || activeAudioState === 'paused' ? 'active' : ''}`}>
      <Slider
        min={0}
        max={100}
        defaultValue={10}
        step={0.00001}
        value={activeTrackProgress}
        handleStyle={{
          borderColor: 'white',
          height: 12,
          width: 12,
          backgroundColor: 'white',
        }}
        onChange={handleSliderEvent}/>
    </div>
  </div>;
}
