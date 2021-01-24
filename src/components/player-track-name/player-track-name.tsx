import React, {
  Ref,
  useEffect,
  useRef,
  useState
} from 'react';
import { useSelector } from 'react-redux';
import {
  Track
} from "../../interfaces";
import { Particle } from '../../lib/Particle';

import { RootState } from 'store/root-reducer';

import './player-track-name.scss';
const TEXT_SIZE = 23,
  TEXT_SPACE = 15,
  TEXT_TOP_OFFSET = TEXT_SIZE;

interface TrackData {
  title: string;
  index: number,
  particles: Particle[],
  animate: {
    f?: (
      trackData: TrackData,
      particle: Particle,
      textMetrics: TextMetrics,
      width: number) => void, textMetrics: TextMetrics
  },
}

const createTrackObject = (key: number, particles: Particle[], textMetrics: TextMetrics, t: string): TrackData => (
  {index: key, particles: particles, animate: {textMetrics: textMetrics}, title: t});

const initializeCanvas = (ref: Ref<HTMLCanvasElement>, tracks: Track[]): TrackData[] => {
  // @ts-ignore
  const box: DOMRect = ref.current.parentNode.getBoundingClientRect();
  // @ts-ignore
  const ctx: CanvasRenderingContext2D = ref.current.getContext('2d');
  // @ts-ignore
  ref.current.width = box.width;
  // @ts-ignore
  ref.current.height = box.height;

  // @ts-ignore
  const width: number = box.width;
  // @ts-ignore
  const height: number = box.height;

  ctx.fillStyle = '#f8f8ff';
  ctx.font = `${TEXT_SIZE}px Syncopate`;
  ctx.textBaseline = 'middle';

  const trackData: TrackData[] = tracks.map((track: Track, idx: number): TrackData => {
    let textMetrics: TextMetrics = ctx.measureText(track.title);
    ctx.fillText(track.title,
      0,
      Math.round(TEXT_SIZE + TEXT_SPACE) * (idx + 1));

    return createTrackObject(
      idx,
      createParticleArray(ref, width, height),
      textMetrics,
      track.title
    );
  });

  ctx.clearRect(0, 0, width, height);
  return trackData;
}

const createParticleArray = (ref: Ref<HTMLCanvasElement>, width: number, height: number): Particle[] => {
  // @ts-ignore
  const ctx: CanvasRenderingContext2D = ref.current.getContext('2d');
  const imageData: ImageData = ctx.getImageData(0, 0, width, height);
  const imageBuffer: Uint32Array = new Uint32Array(imageData.data.buffer);
  const particles: Particle[] = [];

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {

      let color = imageBuffer[y * width + x];
      if (color) {
        particles.push(new Particle({
          color: ''+color,
          x: -1,
          y: -1,
          hx: x,
          hy: y,
        }));
      }
    }
  }
  return particles;
}

const animate = (ref: Ref<HTMLCanvasElement>, trackData: TrackData[]) => {
  // @ts-ignore
  const width = ref.current.width;
  // @ts-ignore
  const height = ref.current.height;

  // @ts-ignore
  const ctx: CanvasRenderingContext2D = ref.current.getContext('2d');
  ctx.clearRect(0, 0, width, height);

  const imageData: ImageData = ctx.createImageData(width, height);
  const pixels: Uint32Array  = new Uint32Array(imageData.data.buffer);

  trackData.forEach((track: TrackData) => {
    animateTrackParticles(pixels, track, height, width);
  });

  ctx.putImageData(imageData, 0, 0);
  requestAnimationFrame(() => animate(ref, trackData));
}

const animateTrackRemove = (trackData: TrackData, particle: Particle, textMetrics: TextMetrics) => {
  particle.gravity += Math.max(Math.random() * 0.002, 0.001);
  //particle.gravity = particle.y * 0.0002;//Math.max(Math.random() * 0.2, 0.1);
}

const animateTrackActive = (trackData: TrackData, particle: Particle, textMetrics: TextMetrics, width: number) => {
  let direction = {
      x: (width / 2 ) - (trackData.animate.textMetrics.width / 2) + (particle.hx - particle.x),
      y: (particle.hy - ((TEXT_SIZE + TEXT_SPACE) * (trackData.index + 1))) + (TEXT_TOP_OFFSET) - particle.y
      //y: (particle.hy - ((TEXT_SIZE + TEXT_SPACE) * (trackObject.index + 1))) + (height / 2) - particle.y
    };
  const distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y );
  const speed = Math.random() * (distance > 1 ? Math.max(distance / 2, 5) : distance);

  direction = Particle.normalize(direction);
  direction.x = direction.x * speed;
  direction.y = direction.y * speed;

  particle.x += direction.x;
  particle.y += direction.y;
}

const animateTrackParticles = (pixels: Uint32Array, trackObject: TrackData, canvasHeight: number, canvasWidth: number) => {
  trackObject.particles.forEach((particle) => {
    const x = Math.round(particle.x);
    const y = Math.round(particle.y);

    if (x >= 0 && x < canvasWidth && y >= 0 && y < canvasHeight) {
      pixels[x + canvasWidth * y] = +particle.color;

      if (trackObject.animate.f) {
        trackObject.animate.f(
          trackObject,
          particle,
          trackObject.animate.textMetrics,
          canvasWidth);

        particle.update();
      }
    }
  });
}

const setTrackNext = (ref: Ref<HTMLCanvasElement>, trackData: TrackData) => {
  // @ts-ignore
  const width = ref.current.width;

  trackData.animate.f = animateTrackActive;
  trackData.particles.forEach((particle: Particle) => {
    particle.vx = 0;
    particle.vy = 0;
    particle.gravity = 0;
    particle.x = (width * 0.5);
    particle.y = TEXT_TOP_OFFSET;
  });
}

const setTrackIdle = (trackObject: TrackData) => {
  trackObject.animate.f = animateTrackRemove;

  trackObject.particles.forEach((particle: Particle) => {
    particle.gravity = particle.y * Math.max(Math.random() * 0.003, 0.001);
    //particle.vy += 0.005;
  });
}

export const PlayerTrackName = () => {
  const tracks: Track[] = useSelector((state: RootState) => state.player.tracks);
  const isBackgroundLoaded: boolean = useSelector((state: RootState) => state.player.backgroundLoaded);
  const trackActive: number = useSelector((state: RootState) => state.player.trackActive);
  const canvasRef: Ref<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
  const [trackParticles, setTrackParticles] = useState<TrackData[]>(null);
  const [previousTrackActive, setPreviousTrackActive] = useState<number>(0);

  useEffect(() => {
    if (tracks.length > 0) {
      const data: TrackData[] = initializeCanvas(canvasRef, tracks);
      setTrackParticles(data);
      // setTrackNext(canvasRef, data[0]);
      // animate(canvasRef, data);
    }
  }, [tracks]);

  useEffect(() => {
    if (isBackgroundLoaded && trackParticles.length > 0) {
      // const data: TrackData[] = initializeCanvas(canvasRef, tracks);
      // setTrackParticles(data);
      setTrackNext(canvasRef, trackParticles[0]);
      animate(canvasRef, trackParticles);
    }
  }, [isBackgroundLoaded]);

  const nextTrack = useEffect(() => {
    if (tracks.length > 0 && isBackgroundLoaded && trackParticles.length > 0) {
      if (trackActive === previousTrackActive) {
        return;
      }
      setTrackIdle(trackParticles[previousTrackActive]);
      setTrackNext(canvasRef, trackParticles[trackActive]);
    }
  }, [previousTrackActive, trackActive, trackParticles, isBackgroundLoaded]);

  useEffect(() => {
    setPreviousTrackActive(trackActive);
  }, [nextTrack, trackActive]);

  return (
    <div className='track-name-container'>
      <div className='container-canvas'>
        <canvas ref={canvasRef}/>
      </div>
    </div>);
}
