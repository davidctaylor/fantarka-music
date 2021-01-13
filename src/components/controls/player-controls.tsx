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

  // const handleTimeUpdate = (): () => void => {
  //   let last = -1;
  //   return () => {
  //     const progress: number = (audioRef.current.currentTime / audioRef.current.duration) * 100;
  //     if (progress !== last) {
  //       dispatch(trackProgress((progress > 0 ? progress : 0)));
  //       last = progress;
  //     }
  //   };
  // }

  // useEffect(() => {
  //   if (audioRef && tracks.length > 0) {
  //     const url: string = `${tracks[activeTrack].stream_url}?client_id=${clientId}`;
  //
  //     if ((controlAction === 'play' || activeAudioState === 'playing') && audioRef.current.src !== url) {
  //       audioRef.current.src = url;
  //       // audioRef.current.load();
  //       audioRef.current.play();
  //       dispatch(trackSeek(0));
  //     }
  //
  //     if (controlAction === 'pause') {
  //       audioRef.current.pause();
  //       dispatch(audioState('stopped'));
  //     }
  //     if (controlAction === 'play') {
  //       audioRef.current.play();
  //       dispatch(audioState('playing'));
  //     }
  //     if ((controlAction === 'next' || controlAction === 'previous') && audioRef.current.src) {
  //       if (activeAudioState === 'playing') {
  //         audioRef.current.pause();
  //         audioRef.current.play();
  //       } else {
  //         audioRef.current.pause();
  //       }
  //     }
  //   }
  // }, [dispatch, audioRef, tracks, activeTrack, activeAudioState, controlAction, clientId]);
  //
  // useEffect(() => {
  //   if (audioRef && tracks.length > 0 && activeAudioState === 'playing') {
  //     audioRef.current.currentTime = (activeSeek / 100) * audioRef.current.duration;
  //   }
  // }, [activeSeek, activeAudioState]);

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
