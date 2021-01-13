import React, { useState } from 'react';

import {
  FontAwesomeIcon,
} from '@fortawesome/react-fontawesome';

import { faPlay, faPause, faStepForward, faStepBackward, faAngleLeft, faAngleRight, faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons';

import './control-button.scss';

export type ControlsType =  'backward' | 'down' | 'forward' | 'play' | 'pause' | 'previous' | 'next';
interface ControlButtonType {
  iconType: ControlsType;
  onClick: (t: ControlsType) => void;
}
type ControlButtonState = {
  active: boolean
};

const icon = (i: ControlsType)  => {
  switch(i) {
    case 'forward':
      return faStepForward;
    case 'backward':
      return faStepBackward;
    case 'play':
      return faPlay;
    case 'pause':
      return faPause;
    case 'previous':
      return faAngleLeft;
    case 'next':
      return faAngleRight;
    case 'down':
      return faLongArrowAltDown;
  }
}

export const ControlButton = ({iconType, onClick}: ControlButtonType) => {
  const [active, setActive] = useState(false);
  return (
    <button className='control-button'
            role='switch' aria-checked='false'
            onClickCapture={() => {
              setActive(true);
              onClick(iconType);
            }}
            onAnimationEnd={() => {
              setActive(false);
            }}>
      {<div className={active ? 'control-button-ripple active' : 'control-button-ripple'}/>}
      <FontAwesomeIcon icon={icon(iconType)} color="white"/>
    </button>
  );
}
export default ControlButton;
