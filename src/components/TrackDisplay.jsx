import React from 'react';
import { Particle } from '../lib/Particle';

import {
  PLAYER_STATE,
  PLAYER_EVENT_LOAD,
  PLAYER_CTRL,
} from '../actions/';

const MOBILE = (window !== 'undefined') ? (window.screen.availWidth < 800) : true;

const TRACK_STATE_ACTIVE = Symbol('active'),
  TRACK_STATE_IDLE = Symbol('idle');

const TEXT_SIZE = 23,
  TEXT_SPACE = 15,
  TEXT_TOP_OFFSET = TEXT_SIZE * 3;

const rgbToRgb = (r, g, b) => {
  return `rgb(${r}, ${g}, ${b})`;
}

const createTrackObject = (tracks, key, particles, width, height) => {
  return {
    ...tracks,
    [key]: {
      index: key,
      state: TRACK_STATE_IDLE,
      particles: particles,
      animate: {f: null, w: width, h: height},
    }
  };
}

const createTrackParticles = (particles, x, y, color) => {
  return [
    ...particles,
    new Particle({
      color: color,
      x: -1,
      y: -1,
      hx: x,
      hy: y,
      g: 0,
    })
  ];
}

const animateTrackRemove = (trackObject, particle, index, width, height) => {
  particle.gravity += Math.max(Math.random() * 0.002, 0.001);
  //particle.gravity = particle.y * 0.0002;//Math.max(Math.random() * 0.2, 0.1);
}

const animateTrackActive = (trackObject, particle, width, height) => {
  let direction = {
      x: (width / 2 ) - (trackObject.animate.w / 2) + (particle.hx - particle.x),
      y: (particle.hy - ((TEXT_SIZE + TEXT_SPACE) * (trackObject.index + 1))) + (TEXT_TOP_OFFSET) - particle.y
      //y: (particle.hy - ((TEXT_SIZE + TEXT_SPACE) * (trackObject.index + 1))) + (height / 2) - particle.y
    },
    distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y ),
    speed = Math.random() * (distance > 1 ? Math.max(distance / 2, 5) : distance);

  direction = Particle.normalize(direction);
  direction.x = direction.x * speed;
  direction.y = direction.y * speed;

  particle.x += direction.x;
  particle.y += direction.y;
}

const animateTrackParticles = (trackObject, pixels, width, height) => {
  trackObject.particles.forEach((particle) => {
    let x = Math.round(particle.x),
      y = Math.round(particle.y);

    if (x >= 0 && x < width && y >= 0 && y < height) {
      pixels[x + width * y] = particle.color;

      if (trackObject.animate.f) {
        trackObject.animate.f(
          trackObject,
          particle,
          width,
          height);

        particle.update();
      }
    }
  });
}

const animateTrackNext = (trackObject, width, height) => {
  trackObject.particles.forEach(particle => {
    particle.vx = 0;
    particle.vy = 0;
    particle.gravity = 0;
    particle.x = (width * 0.5);
    particle.y = TEXT_TOP_OFFSET;
  });

  trackObject.animate.f = animateTrackActive;

  trackObject.state = TRACK_STATE_ACTIVE;
}

const setTrackIdle = (trackObject, width, height) => {
  trackObject.animate.f = animateTrackRemove;

  trackObject.particles.forEach(particle => {
    particle.gravity = particle.y * Math.max(Math.random() * 0.003, 0.001);
    //particle.vy += 0.005;
  });

  trackObject.state = TRACK_STATE_IDLE;
}

export class TrackDisplay extends React.Component {

  constructor(props) {
    super(props);

    this.canvas;
    this.ctx = null;
    this.trackObjects = {};
    this.counter = 0;
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    switch (nextProps.playerAction) {
    case PLAYER_EVENT_LOAD:
      this.initializeCanvas(nextProps.playerTracks);
      animateTrackNext(this.trackObjects[nextProps.trackActive], this.canvas.width, this.canvas.height);
      this.animate();
      break;


    case PLAYER_STATE:
    case PLAYER_CTRL:
      this.setTrackNext(nextProps.playerAction,
        nextProps.playerState, nextProps.trackActive, this.canvas.width, this.canvas.height);
      break;

      default:
    }
  }

  render() {
    return (
      <div className='player-sc-text'>
        <div className='player-sc-spacer'></div>
        <div className='player-sc-canvas'>
          <canvas
            ref={(e) => this.canvas = e}
          />
        </div>
      </div>);
  }

  initializeCanvas(tracks) {
    const box = this.canvas.parentNode.getBoundingClientRect();
    this.canvas.width = box.width;
    this.canvas.height = box.height;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = '#f8f8ff';
    this.ctx.font = `${TEXT_SIZE}px 'Syncopate'`;
    this.ctx.textBaseline = 'middle';

    tracks.forEach((track, idx) => {
      let textSize = this.ctx.measureText(track.title);
      this.ctx.fillText(track.title,
        0,
        Math.round(TEXT_SIZE + TEXT_SPACE) * (idx + 1));

      this.trackObjects =
        createTrackObject(
          this.trackObjects,
          idx,
          this.createParticleArray(this.canvas.width, this.canvas.height),
          textSize.width,
          textSize.height
        );
    });
  }

  createParticleArray(width, height) {
    const imageData = this.ctx.getImageData(0, 0, width, height),
      imageBuffer = new Uint32Array(imageData.data.buffer);
    let particles = [];

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {

        let color = imageBuffer[y * width + x];
        if (color) {
          particles = createTrackParticles(particles, x, y, color);
        }
      }
    }

    this.ctx.clearRect(0, 0, width, height);

    return particles;
  }

  animate() {
    const width = this.canvas.width,
      height = this.canvas.height
    this.ctx.clearRect(0, 0, width, height);

    let imageData = this.ctx.createImageData(width, height),
      pixels = new Uint32Array(imageData.data.buffer);

    Object.keys(this.trackObjects).forEach(key => {
      animateTrackParticles(this.trackObjects[key], pixels, width, height);
    });

    this.ctx.putImageData(imageData, 0, 0);

    requestAnimationFrame(() => this.animate());
  }

  setTrackNext(playerAction, playerState, trackActive, width, height) {
    let isActive = false;

    Object.keys(this.trackObjects).forEach(key => {
      if (this.trackObjects[key].state === TRACK_STATE_ACTIVE &&
        key === ('' + trackActive)) {
        isActive = true;
        return;
      }
    });

    if (isActive) {
      return;
    }

    Object.keys(this.trackObjects).forEach(key => {
      if (this.trackObjects[key].state === TRACK_STATE_ACTIVE) {
        setTrackIdle(this.trackObjects[key], width, height);
      }
    });

    animateTrackNext(this.trackObjects[trackActive], width, height);
  }

  getPixelColor(x, y) {
    let idx = ((this.imageData.width * y) + x ) * 4;
    return rgbToRgb(
      this.imageData.data[idx],
      this.imageData.data[idx + 1],
      this.imageData.data[idx + 2]);
  }

  checkAlpha(x, y){
    let idx = ((this.imageData.width * y) + x ) * 4;
    return this.imageData.data[idx + 3] > 0;
  }
}

TrackDisplay.propTypes = {
  playerState: React.PropTypes.symbol.isRequired,
  playerTracks: React.PropTypes.array.isRequired
}