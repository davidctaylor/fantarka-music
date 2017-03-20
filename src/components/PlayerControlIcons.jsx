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
  <svg width='40px' height='40px' >
      {props.children}
  </svg>
);

export const PlayIcon = (props) => (
  <PlayerControlIcons>
    <path onClick={(evt) => props.onClick(evt, (
        props.playerState === PLAYER_STATE_ACTIVE ? PLAYER_CTRL_PAUSE : PLAYER_CTRL_PLAY))}
          transform='translate(0, 5)'
          className={props.playerState === PLAYER_STATE_ACTIVE ? 'visible' : 'hidden'}
          d='M0 4 L0 28 L16 28 L20 28 L20 4 L12 4 L12 28 L8 28 L8 4 Z'/>
    <path onClick={(evt) => props.onClick(evt, PLAYER_CTRL_PLAY)}
          transform='translate(0, 5)'
          className={props.playerState === PLAYER_STATE_IDLE &&
          props.playerTracks.length > 0 ? 'visible' : 'hidden'}
          //d='M0 32 L0 64 L16 48 Z'/>
          d='M0 0 L0 32 L24 16 Z'/>

  </PlayerControlIcons>
);

// export const ProgressControls = (props) => (
//   <div className={`controls ${props.playerState === PLAYER_STATE_ACTIVE ? 'visible' : 'hidden'}`}>
//     <PlayerControlIcons>
//     <path onClick={(evt) => props.onClick(evt, PLAYER_CTRL_PREVIOUS)}
//           className='prev'
//           transform='translate(0, -28) scale(1)'
//           d='M16 64 L0 48 L16 32 L16 48 L32 32 L32 64 L16 48 Z'/>
//   </PlayerControlIcons>
//     <ProgressBar trackProgress={props.trackProgress}/>
//     <PlayerControlIcons className='next'>
//       <path onClick={(evt) => props.onClick(evt, PLAYER_CTRL_NEXT)}
//             transform='translate(0, -28) scale(1)'
//             className='next'
//             d='M0 32 L0 64 L16 48 L16 64 L32 48 L16 32 L16 48 Z'/>
//     </PlayerControlIcons>
//   </div>
// );

export const ProgressControls = (props) => (
  <div className={`controls ${props.playerState === PLAYER_STATE_ACTIVE ? 'visible' : 'hidden'}`}>
    <ProgressBar trackProgress={props.trackProgress}/>
  </div>
);

export const ProgressBar = (props) => (
  <div className='progress-bar'>
    <div className='progress' style={{width:`${props.trackProgress}%`}}></div>
  </div>
)

export const PlayPrev = (props) => (
  <PlayerControlIcons className='prev'>
    <path onClick={(evt) => props.onClick(evt, PLAYER_CTRL_PREVIOUS)}
          transform='translate(0, 10) scale(0.6)'
          className={props.playerTracks.length > 0 ? 'visible' : 'hidden'}
          //d='M6 64 L6 48 L0 48 L16 64 L16 32 L0 48 L6 48 L6 32 L0 32 L0 64'/>
          d='M24 32 L0 16 L24 0 L24 16 L48 0 L48 32 L24 16 Z'/>


  </PlayerControlIcons>
)

export const PlayNext = (props) => (
  <PlayerControlIcons >
    <path onClick={(evt) => props.onClick(evt, PLAYER_CTRL_NEXT)}
          transform='translate(0, 10)  scale(0.6)'
          className={props.playerTracks.length > 0 ? 'visible' : 'hidden'}
          //d='M16 48 L10 48 L10 64 L16 64 L16 32 L10 32 L10 48 L16 48 L0 32 L0 64'/>
          d='M0 0 L0 32 L24 16 L24 32 L48 16 L24 0 L24 16 Z'/>
  </PlayerControlIcons>
)
//style="fill:#030104;"
export const SoundCloudLogo = (props) => (
  <div style={{width: props.width, height: props.width}} onClick={(evt) => props.handleOnClick(evt, 'soundCloud')}>
    <svg x="0px" y="0px" viewBox='0 0 100 100'>

      <g style={{fill: 'rgba(255, 85, 0, 1)'}}>
        <path d="M3.361,67.281L5,60.279l-1.639-7.238c-0.045-0.215-0.457-0.379-0.959-0.379
c-0.508,0-0.92,0.164-0.959,0.381L0,60.279l1.443,7.002c0.039,0.217,0.451,0.381,0.959,0.381
C2.904,67.662,3.316,67.498,3.361,67.281z M13.611,71.168L15,60.348l-1.389-16.74c-0.041-0.426-0.561-0.76-1.191-0.76
c-0.635,0-1.156,0.334-1.188,0.76L10,60.348l1.232,10.82c0.031,0.422,0.553,0.756,1.188,0.756
C13.051,71.924,13.57,71.594,13.611,71.168z M23.84,70.99L25,60.354l-1.16-22.287c-0.031-0.523-0.648-0.934-1.404-0.934
c-0.762,0-1.379,0.41-1.406,0.934L20,60.354l1.029,10.642c0.027,0.519,0.645,0.928,1.406,0.928
C23.191,71.922,23.809,71.514,23.84,70.99z M34.049,70.832L35,60.355l-0.951-22.449c-0.023-0.621-0.727-1.107-1.6-1.107
c-0.879,0-1.582,0.486-1.604,1.107L30,60.355l0.85,10.475c0.018,0.615,0.721,1.102,1.6,1.102
C33.322,71.932,34.025,71.453,34.049,70.832z M44.248,70.699L45,60.359l-0.752-25.74c-0.016-0.707-0.818-1.281-1.787-1.281
c-0.971,0-1.771,0.576-1.787,1.281L40,60.352c0,0.017,0.674,10.349,0.674,10.349c0.016,0.698,0.816,1.272,1.787,1.272
C43.43,71.973,44.232,71.406,44.248,70.699z M51.391,71.98C51.424,71.982,86.883,72,87.114,72C94.232,72,100,66.42,100,59.537
c0-6.885-5.768-12.465-12.887-12.465c-1.766,0-3.449,0.348-4.984,0.969C81.104,36.811,71.363,28,59.484,28
c-2.906,0-5.742,0.553-8.244,1.488c-0.972,0.366-1.232,0.739-1.24,1.467v39.553C50.01,71.27,50.621,71.906,51.391,71.98z"/>
      </g>
    </svg>
  </div>
);
export const AboutIcon = (props) => (
  <div className='player-sc-footer-about' onClick={(evt) => props.handleOnClick(evt, 'about')}>
    <svg  x="0px" y="0px" viewBox='0 0 487.65 487.65'>
      <g>
        <path
          d="M243.824,0C109.163,0,0,109.163,0,243.833C0,378.487,109.163,487.65,243.824,487.65   c134.662,0,243.826-109.163,243.826-243.817C487.65,109.163,378.486,0,243.824,0z M243.762,103.634   c20.416,0,36.977,16.555,36.977,36.977c0,20.425-16.561,36.978-36.977,36.978c-20.424,0-36.986-16.553-36.986-36.978   C206.775,120.189,223.338,103.634,243.762,103.634z M307.281,381.228c0,3.695-2.995,6.691-6.684,6.691h-21.509h-70.663h-21.492   c-3.689,0-6.683-2.996-6.683-6.691v-13.719c0-3.694,2.993-6.689,6.683-6.689h21.492V230.706h-22.153   c-3.689,0-6.685-2.996-6.685-6.692V210.28c0-3.695,2.996-6.69,6.685-6.69h22.153h63.981h0.216c3.686,0,6.683,2.995,6.683,6.69   v150.539h21.293c3.688,0,6.684,2.995,6.684,6.689V381.228z"/>
      </g>
    </svg>
  </div>
);