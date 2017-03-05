import React, { PropTypes} from 'react';

import { Particle } from '../lib/Particle';

const SPACING = 4,
  DEFAULT_MOUSE_MASS = 10;

const rgbToRgb = (r, g, b) => {
  return `rgb(${r}, ${g}, ${b})`;
}

const loadImage = (url) => {
  const image = new Image();
  const promise = new Promise((fulfill, fail) => {
    image.onload = () => fulfill(image);
    image.onerror = (...err) => fail(err);
  });

  image.src = url;

  return promise;
}

const initialPosition = () => {
  let direction = {x: this.hx - this.x, y: this.hy - this.y},
    distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y ),
    speed = Math.random() * (distance > 1 ? Math.min(distance, 100) : distance);

  direction = Particle.normalize(direction);
  direction.x = direction.x * speed;
  direction.y = direction.y * speed;

  this.x += direction.x;
  this.y += direction.y;
}

export class PlayerBackgroundImage extends React.Component {
  constructor(props) {
    super(props);

    this.canvas;
    this.ctx = null;
    this.particles = [];
    this.isLoading = true;
  }

  componentDidMount() {
    this.mouseParticle = new Particle({
      x: this.props.width / 2,
      y: this.props.height / 2,
      hx: this.props.width / 2,
      hy: this.props.width / 2,
      g: 0,
      direction: 0,
      speed: 0,
    });
    this.mouseParticle.mass = DEFAULT_MOUSE_MASS;

    this.ctx = this.canvas.getContext('2d');

    loadImage(this.props.imageURL).then((img) => {
        this.renderImage(img);
        this.createParticles();
      },
      (err) => console.log('Error loading image:', err)
    );
  }

  componentWillReceiveProps(nextProps) {
    this.isLoading = nextProps.mouseVector.x === 0 && nextProps.mouseVector.y === 0;
    this.mouseParticle.x = nextProps.mouseVector.x;
    this.mouseParticle.y = nextProps.mouseVector.y;
    this.mouseParticle.mass = DEFAULT_MOUSE_MASS;
  }

  render = () => {
    return (
      <div className='player-sc-image'>
        <canvas
          width={this.props.width}
          height={this.props.height}
          ref={(e) => this.canvas = e}
        />
      </div>);
  }

  renderImage = (image) => {
    let width = this.props.width / 4,
      height = this.props.height / 4;

    this.ctx.drawImage(image, 0, 0, width, height);
    this.imageData = this.ctx.getImageData(0, 0, width, height);
  }

  createParticles = () => {
    this.animate();

    for (let x = 0; x < this.props.width / 4; x += 1) {
      for (let y = 0; y < this.props.height / 4; y += 1) {

        let particle = new Particle({
          color: this.getPixelColor(x, y),
          x: this.props.width / 2,
          y: this.props.height / 2,
          hx: x * SPACING,
          hy: y * SPACING,
          g: 0,
        });

        this.particles.push(particle);
      }
    }
  }

  animate = () => {
    this.ctx.clearRect(0, 0, this.props.width, this.props.height);

    if (this.isLoading) {
      this.animateInitial();
    } else {
      this.mouseParticle.mass = this.mouseParticle.mass > 0 ? this.mouseParticle.mass -= 0.1 : 0;
      this.animateMouseMove();
    }

    requestAnimationFrame(() => this.animate());
  }

  animateInitial = () => {
    this.particles.forEach((p) => {
      let direction = {x: p.hx - p.x, y: p.hy - p.y},
        distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y),
        speed = Math.random() * (distance > 1 ? Math.min(distance, 100) : distance);

      direction = Particle.normalize(direction);
      direction.x = direction.x * speed;
      direction.y = direction.y * speed;

      p.x += direction.x;
      p.y += direction.y;

      this.drawParticle(p);
    });
  }

  animateMouseMove = () => {
    this.particles.forEach((p) => {
      p.rejection(this.mouseParticle);
      p.update();

      this.drawParticle(p);
      if ((p.x > this.props.width || p.x < 0) &&
        (p.y > this.props.height || p.y < 0)) {
        p.x = p.hx;
        p.y = p.hy;
      }
    });
  }

  drawParticle = (p, reset) => {
    let particleSize = 2;
    this.ctx.fillStyle = p.color;
    this.ctx.fillRect(p.x, p.y, particleSize, particleSize);
  }

  getPixelColor = (x, y) => {
    let idx = ((this.imageData.width * y) + x ) * 4;
    return rgbToRgb(
      this.imageData.data[idx],
      this.imageData.data[idx + 1],
      this.imageData.data[idx + 2]);
  }
}

PlayerBackgroundImage.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  imageURL: PropTypes.string.isRequired,
  mouseVector: PropTypes.object.isRequired
}
