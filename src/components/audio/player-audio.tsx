import React from 'react';
import { Ref, useEffect, useRef } from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';

import {
  PlayerControlType,
  AudioStateType,
  Track
} from 'interfaces/index';

import { RootState } from 'store/root-reducer';
import './player-controls.scss';
import { audioState, trackProgress, trackSeek } from "../player/player-slice";

interface PlayerAudioProps {
  clientId: string
}

export const PlayerAudio = ({clientId}: PlayerAudioProps) => {
  const dispatch = useDispatch();
  const tracks: Track[] = useSelector((state: RootState) => state.player.tracks);
  const activeTrack: number = useSelector((state: RootState) => state.player.trackActive);
  const activeSeek: number = useSelector((state: RootState) => state.player.trackSeek);
  const activeAudioState: AudioStateType | null = useSelector((state: RootState) => state.player.audioState);
  const audioRef: Ref<HTMLAudioElement> = useRef<HTMLAudioElement>(null);
  const controlAction: PlayerControlType = useSelector((state: RootState) => state.player.controlAction);

  const track = (): () => void => {
    let last = -1;
    return () => {
      const progress: number = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      if (progress !== last) {
        dispatch(trackProgress((progress > 0 ? progress : 0)));
        last = progress;
      }
    };
  }

  useEffect(() => {
    if (audioRef && tracks.length > 0) {
      const url: string = `${tracks[activeTrack].stream_url}?client_id=${clientId}`;

      if (audioRef.current.src !== url) {
        audioRef.current.src = url;
        dispatch(trackSeek(0));
      }

      if (controlAction === 'pause') {
        audioRef.current.pause();
        dispatch(audioState('stopped'));
      }
      if (controlAction === 'play') {
        audioRef.current.play();
        dispatch(audioState('playing'));
      }
      if (controlAction === 'next' || controlAction === 'previous') {
        if (activeAudioState === 'playing') {
          audioRef.current.pause();
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [dispatch, audioRef, tracks, activeTrack, activeAudioState, controlAction, clientId]);

  useEffect(() => {
    if (audioRef && tracks.length > 0 && activeAudioState === 'playing') {
      audioRef.current.currentTime = (activeSeek / 100) * audioRef.current.duration;
    }
  }, [activeSeek]);

  return <audio ref={audioRef} crossOrigin={'anonymous'}
                onTimeUpdate={track()}/>;
}
