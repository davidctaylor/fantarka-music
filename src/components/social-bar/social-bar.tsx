import React, { CSSProperties } from 'react';
import {
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon
} from 'react-share';
import './social-bar.scss';

import { SoundCloudLogo } from 'icons/soundcloud-icon';

import { handleOnShareEvent } from 'lib/utils';

const ICON_SIZE = 32,
  SHARE_URL = 'http://www.fantarka.com/',
  SHARE_TITLE = 'Fantarka Music';

export const SocialBar = () => {
  const imageStyle: CSSProperties = {
    paddingLeft: '0.5em',
    paddingRight: '0.5em',
    paddingTop: '1px',
  };

  return (
    <div className='social-bar-container'>
      {/*
        // @ts-ignore */}
      <EmailIcon size={ICON_SIZE} round={true} onClick={(e: Event) => handleOnShareEvent(e, 'email')}/>
      {/*
        // @ts-ignore */}
      <FacebookShareButton url={SHARE_URL} style={imageStyle} children={<FacebookIcon size={ICON_SIZE} round={true}/>}/>
      {/*
        // @ts-ignore */}
      <TwitterShareButton url={SHARE_URL} style={imageStyle} title={SHARE_TITLE} children={<TwitterIcon size={ICON_SIZE} round={true}/>}/>
      {/*  <TwitterIcon size={ICON_SIZE} round logoFillColor={ICON_COLOR}/>*/}
      <SoundCloudLogo width={ICON_SIZE} onClick={(e: Event) => handleOnShareEvent(e, 'sound-cloud')}/>
    </div>);
};
