import React, {
  useEffect,
  useState,
  CSSProperties,
  useRef
} from 'react'
import {
  useDispatch,
  useSelector,
} from 'react-redux'

import Loader from 'react-loader-spinner'

import { RootState } from 'store/root-reducer'
import { useScrollPosition } from 'components/effects/scroll';
import {
  AudioStateType,
  ScrollPosition,
  Track
} from 'interfaces/index';
import { handleOnShareEvent } from 'lib/utils';
import {
  playerControls,
  trackActive
} from 'components/player/player-slice';
import './track-list.scss';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

interface TrackListProps {
  onClick: (e: any) => void;
}

export const TrackList = ({onClick }: TrackListProps) => {
  const dispatch = useDispatch();
  const tracks: Track[] = useSelector((state: RootState) => state.player.tracks);
  const activeAudioState: AudioStateType | null = useSelector((state: RootState) => state.player.audioState);
  const activeTrack: number = useSelector((state: RootState) => state.player.trackActive);
  const refTrackDesc = useRef<HTMLDivElement>(null);
  const [trackDescHeight, setTrackDescHeight] = useState<number>(0);
  const refTrackList = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({x: 0, y: 0, w: 0, h: 0});

  useScrollPosition(['scroll'], setScrollPosition);

  // @ts-ignore
  useEffect(() => setTrackDescHeight(refTrackDesc.current.clientHeight), []);

  const containerStyle: CSSProperties = {
    opacity: `${((trackDescHeight - (scrollPosition.y - scrollPosition.h * 0.4)) / trackDescHeight)}`, //`${Math.max(1, s)})`,
  };

  const handleOnClickEvent = (idx: number) => {
    dispatch(playerControls('play'))
    dispatch(trackActive(idx));
  }

  const renderedTracks = tracks.map((t: Track, i: number) => {
    const imageStyle: CSSProperties = {
      background: 'url(' + t.artwork_url + ') no-repeat center center',
      backgroundSize: 'cover',
    };

    return <div key={i} onClick={() => handleOnClickEvent(i)} className="track-container">
      {(() => {
        if (t.artwork_url) {
          return (<div className="container-image">
            <div className="image" style={imageStyle}></div>
          </div>)
        } else {
          return (<div className="container-image"/>)
        }
      })()}
      <div className="container-content">
        {activeAudioState === 'playing' && activeTrack === i &&
          <Loader
            className="container-loader"
            type="Audio"
            color="#f8f8ff"
            height={20}
            width={20}
            timeout={0}
          />}
        <div className="container-info">
          <div className="title">{t.title}</div>
          <div className="description">{t.description}</div>
        </div>
      </div>
    </div>
  });

  return <div id='container' className="scroll-container-tracks" ref={refTrackList}>
    <div className="tracks-description" ref={refTrackDesc} style={containerStyle}>
      <h1>About</h1>
      <p>Originally from the UK, Fantarka is a Washington D.C. based EDM producer encompassing trance, house and ambient tracks.
      </p>
      <p>Also provides customised tracks to clients including national television networks.
      </p>
      <div className="description-separator"></div>
      <p>Contact us at <span onClick={() => handleOnShareEvent(null, 'email')} className='description-contact'>fantarkamusic@gmail.com</span> for purchasing from our library or customized tracks.
      </p>
    </div>
    <div className="track-list-container" >{renderedTracks}</div>
  </div>
}
