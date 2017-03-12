import React from 'react';

import {
  PLAYER_STATE_IDLE,
  PLAYER_STATE_ACTIVE,
  PLAYER_CTRL_PLAY,
  PLAYER_CTRL_PAUSE,
  PLAYER_CTRL_NEXT,
  PLAYER_CTRL_PREVIOUS,
} from '../actions';

export const PlayerControlIcons = (props) => (
  <svg width='40px' height='40px' viewBox='0 0 40 40'>
      {props.children}
  </svg>
);
//M0 64 L0 32 L0 32 L6 32 L6 64 L10 64 L10 32 L16 32 L16 64 z'
export const PlayIcon = (props) => (
  <PlayerControlIcons>
    <path onClick={(evt) => props.onClick(evt, (
        props.playerState === PLAYER_STATE_ACTIVE ? PLAYER_CTRL_PAUSE : PLAYER_CTRL_PLAY))}
          transform='translate(0, -40) scale(1.2)'
          className={props.playerState === PLAYER_STATE_ACTIVE ? 'visible' : 'hidden'}
          d='M0 64 L0 32 L0 32 L8 32 L8 64 L10 64 L10 32 L18 32 L18 64'/>
    <path onClick={(evt) => props.onClick(evt, PLAYER_CTRL_PLAY)}
          transform='translate(0, -40) scale(1.2)'
          className={props.playerState === PLAYER_STATE_IDLE &&
          props.playerTracks.length > 0 ? 'visible' : 'hidden'}
          d='M0 64 L0 32 L16 48 Z'/>
  </PlayerControlIcons>
);

export const ProgressControls = (props) => (
  <div className={`controls ${props.playerState === PLAYER_STATE_ACTIVE ? 'visible' : 'hidden'}`}>
    <PlayerControlIcons>
      <path onClick={(evt) => props.onClick(evt, PLAYER_CTRL_PREVIOUS)}
            className='prev'
            transform='translate(0, -28) scale(1)'
            d='M16 64 L0 48 L16 32 L16 48 L32 32 L32 64 L16 48 Z'/>
    </PlayerControlIcons>
    <ProgressBar trackProgress={props.trackProgress}/>
    <PlayerControlIcons className='next'>
      <path onClick={(evt) => props.onClick(evt, PLAYER_CTRL_NEXT)}
            transform='translate(0, -28) scale(1)'
            className='next'
            d='M0 32 L0 64 L16 48 L16 64 L32 48 L16 32 L16 48 Z'/>
    </PlayerControlIcons>
  </div>
);

export const ProgressBar = (props) => (
  <div className='progress-bar'>
    <div className='progress' style={{width:`${props.trackProgress}%`}}></div>
  </div>
)

// Volume
export const VolumeIconSVG = (props) => (
    <svg
        className='sb-soundplayer-play-icon'
        fill='currentColor'
        stroke='currentColor'
    >
        {props.children}
    </svg>
);