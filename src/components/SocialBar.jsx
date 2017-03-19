import React from 'react';
import { ShareButtons, generateShareIcon } from 'react-share';
import { SoundCloudLogo } from './PlayerControlIcons';

const {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const GooglePlusIcon = generateShareIcon('google');
const LinkedinIcon = generateShareIcon('linkedin');
const PinterestIcon = generateShareIcon('pinterest');
const TwitterIcon = generateShareIcon('twitter');

const ICON_SIZE = 32,
  ICON_COLOR = 'black',
  SHARE_URL = 'http://www.fantarka.com/',
  SHARE_TITLE = 'Fantarka music';

export const SocialBar = (props) => (
  <div className='player-sc-footer-social'>
    <FacebookShareButton
      url={SHARE_URL}
      title={SHARE_TITLE}
      picture={`${String(window.location)}${props.imageURL}`}
    >
      <FacebookIcon size={ICON_SIZE} round logoFillColor={ICON_COLOR}/>
    </FacebookShareButton>
    <GooglePlusShareButton url={SHARE_URL}>
      <GooglePlusIcon size={ICON_SIZE} round logoFillColor={ICON_COLOR}/>
    </GooglePlusShareButton>
    <LinkedinShareButton
      url={SHARE_URL}
      title={SHARE_TITLE}
      windowWidth={750}
      windowHeight={600}>
      <LinkedinIcon size={ICON_SIZE} round logoFillColor={ICON_COLOR}/>
    </LinkedinShareButton>
    <TwitterShareButton url={SHARE_URL} title={SHARE_TITLE}>
      <TwitterIcon size={ICON_SIZE} round logoFillColor={ICON_COLOR}/>
    </TwitterShareButton>
    <PinterestShareButton
      url={String(window.location)}
      media={`${String(window.location)}${props.imageURL}`}
      windowWidth={1000}
      windowHeight={730}>
      <PinterestIcon size={ICON_SIZE} round logoFillColor={ICON_COLOR}/>
    </PinterestShareButton>
    <SoundCloudLogo width={ICON_SIZE}
                    handleOnClick={props.handleOnClick}/>
  </div>
);