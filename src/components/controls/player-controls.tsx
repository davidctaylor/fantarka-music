import React from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { PlayerControlType, AudioStateType } from 'interfaces/index';

import { RootState } from 'store/root-reducer';
import { ControlButton, ControlsType } from 'components/control-button/control-button';
import { playerControls, trackSeek } from 'components/player/player-slice';
import './player-controls.scss';

export const PlayerControls = () => {
  const dispatch = useDispatch();
  const activeTrackProgress: number = useSelector((state: RootState) => state.player.trackProgress);
  const activeAudioState: AudioStateType | null = useSelector((state: RootState) => state.player.audioState);

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
    dispatch(playerControls(c))
  };

  const handleSliderEvent = (p: number) => {
    dispatch(trackSeek(p));
  };

  return <div className='player-controls'>
    <div className='controls-buttons'>
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
