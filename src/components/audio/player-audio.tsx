import React, { useState } from 'react';
import { Ref, useEffect, useRef } from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';

import {
  PlayerControlType,
  AudioStateType,
  Track,
} from 'interfaces/index';

import { RootState } from 'store/root-reducer';
import { audioState, trackProgress, trackSeek } from "../player/player-slice";

interface PlayerAudioProps {
  clientId: string;
  streamURL: string;
  controlAction: PlayerControlType;
}

export const PlayerAudio = ({clientId, streamURL, controlAction}: PlayerAudioProps) => {
  const dispatch = useDispatch();
  const tracks: Track[] = useSelector((state: RootState) => state.player.tracks);
  const activeTrack: number = useSelector((state: RootState) => state.player.trackActive);
  const tracksLoaded: boolean = useSelector((state: RootState) => state.player.tracksLoaded);
  const activeSeek: number = useSelector((state: RootState) => state.player.trackSeek);
  const activeAudioState: AudioStateType | null = useSelector((state: RootState) => state.player.audioState);
  const audioRef: Ref<HTMLAudioElement> = useRef<HTMLAudioElement>(null);
  const [playerActive, setPlayerActive] = useState<boolean>(false);

  const trackData = (): () => void => {
    let last = -1;
    return () => {
      const progress: number = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      if (progress !== last) {
        dispatch(trackProgress((progress > 0 ? progress : 0)));
        last = progress;
      }
    };
  }

  const trackURL = () => {
    return `${tracks[activeTrack].stream_url}?client_id=${clientId}`;
  }

  useEffect(() => {
    if (audioRef && tracks.length > 0) {
      const url: string = `${tracks[activeTrack].stream_url}?client_id=${clientId}`;

      if (audioRef.current.src !== url) {
        audioRef.current.src = url;
        dispatch(trackSeek(0));
      }

      if (playerActive && controlAction === 'pause') {
        audioRef.current.pause();
        dispatch(audioState('stopped'));
      }
      if (playerActive && controlAction === 'play') {
        audioRef.current.play();
        dispatch(audioState('playing'));
      }
      if (playerActive && (controlAction === 'next' || controlAction === 'previous')) {
        if (activeAudioState === 'playing') {
          audioRef.current.pause();
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [dispatch, audioRef, tracks, activeTrack, activeAudioState, controlAction, clientId, playerActive]);

  useEffect(() => {
    if (audioRef && !Number.isNaN(audioRef.current.duration) && tracksLoaded && activeAudioState === 'playing') {
      audioRef.current.currentTime = (activeSeek / 100) * audioRef.current.duration;
    }
  }, [activeSeek, tracksLoaded, activeAudioState]);

  return <audio autoPlay={!playerActive}
                ref={audioRef}
                src={trackURL()}
                onPlay={(e) => {
                  setPlayerActive(true);
                }}
                crossOrigin={'anonymous'}
                onTimeUpdate={trackData()}/>;
}
