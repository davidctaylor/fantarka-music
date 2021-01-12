import React, {
  useEffect,
  useRef,
  useState,
  Ref
} from 'react';

import { Particle, rgbToString } from 'lib/index';
import { useScrollPosition } from 'components/effects/scroll';
import { ScrollPosition } from 'interfaces/index';
import './player-background.scss';

const SPACING = 4;

const loadBackgroundImage = (url: string): Promise<HTMLImageElement> => {
  const image: HTMLImageElement = new Image();
  const promise = new Promise<HTMLImageElement>((fulfill, fail) => {
    image.onload = () => fulfill(image)
    image.onerror = (...err) => fail(err);
  });

  image.src = url;

  return promise;
};

const getPixelColor = (data: ImageData, x: number, y: number): string => {
  let idx = ((data.width * y) + x) * 4;
  return rgbToString(data.data[idx], data.data[idx + 1], data.data[idx + 2], data.data[idx + 3]);
}

const createParticles = (ref: Ref<HTMLCanvasElement>, data: ImageData): Particle[] => {
  const particles: Particle[] = [];
  // @ts-ignore
  let width = ref.current.width;
  // @ts-ignore
  let height = ref.current.height;

  for (let x = 0; x < width / 4; x += 1) {
    for (let y = 0; y < height / 4; y += 1) {
      particles.push(new Particle({
        color: getPixelColor(data, x, y),
        x: width / 2,
        y: height / 2,
        hx: x * SPACING,
        hy: y * SPACING,
      }));
    }
  }
  return particles
};

const animate = (ref: HTMLCanvasElement, particles: Particle[], isLoading: boolean): void => {
  if (isLoading) {
    const ctx: CanvasRenderingContext2D = ref.getContext('2d');
    ctx.clearRect(0, 0, ref.width, ref.height);

    if (animateInitial(ref, particles)) {
      requestAnimationFrame(() => animate(ref, particles, true));
    }
  }
}

const animateInitial = (ref: HTMLCanvasElement, particles: Particle[]): boolean => {
  let isLoading = true;
  particles.forEach((particle: Particle) => {
    let direction = {x: particle.hx - particle.x, y: particle.hy - particle.y},
      distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y),
      speed = Math.random() * (distance > 1 ? Math.min(distance, 100) : distance);

    direction = Particle.normalize(direction);
    direction.x = direction.x * speed;
    direction.y = direction.y * speed;

    particle.x += direction.x;
    particle.y += direction.y;

    isLoading = distance > 0;

    drawParticle(ref, particle);
  });
  return isLoading;
}

const drawParticle = (ref: HTMLCanvasElement, particle: Particle) => {
  const ctx: CanvasRenderingContext2D = ref.getContext('2d');
  const particleSize = 2;
  ctx.fillStyle = particle.color;
  ctx.fillRect(particle.x, particle.y, particleSize, particleSize);
}

interface PlayerBackgroundProps {
  url: string;
  width: number;
  height: number;
}

export const PlayerBackground = ({url, width, height}: PlayerBackgroundProps) => {
  const canvasRef: Ref<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
  const [canvasImage, setCanvasImage] = useState<HTMLImageElement>(null);
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({x: 0, y: 0, w: 0, h: 0});

  useScrollPosition(['resize'], setScrollPosition);

  useEffect(() => {
    loadBackgroundImage(url)
      .then((img: HTMLImageElement) => {
        setCanvasImage(img);
      }, (err) => console.log('Error loading image:', err));
  }, [url]);

  useEffect(() => {
    // @ts-ignore
    if (!canvasImage) {
      return;
    }
    // @ts-ignore
    const box = canvasRef.current.parentNode.getBoundingClientRect();
    canvasRef.current.width = box.width;
    canvasRef.current.height = box.height;
    let width = box.width / 4;
    let height = box.height / 4;

    const ctx: CanvasRenderingContext2D = canvasRef.current.getContext('2d');
    ctx.drawImage(canvasImage, 0, 0, width, height);
    const particles: Particle[] = createParticles(canvasRef, ctx.getImageData(0, 0, width, height));

    animate(canvasRef.current, particles, true);
  }, [canvasImage]);

  useEffect(() => {
    console.log('XXX canvasRef SCROLL...', canvasRef);
    if (!canvasRef.current) {
      return;
    }
    const img: HTMLImageElement = new Image();
    img.onload = () => {
      canvasRef.current.width = scrollPosition.w;
      canvasRef.current.height = scrollPosition.h;

      const ctx: CanvasRenderingContext2D = canvasRef.current.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, scrollPosition.w, scrollPosition.h);
    }
    img.src = canvasRef.current.toDataURL();

  }, [scrollPosition]);

  return (
    <div className='player-background-image'>
      <canvas ref={canvasRef}/>
    </div>);
};
