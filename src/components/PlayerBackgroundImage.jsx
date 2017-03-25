import React from 'react';

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

    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.isLoading = true;
    this.resizeTimeout = null
    //this.image = null;
  }

  componentDidMount() {
    window.addEventListener('resize', (evt) => this.handleResize(evt));

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

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps) {
    //this.isLoading = nextProps.mouseVector.x === 0 && nextProps.mouseVector.y === 0;
    //this.mouseParticle.x = nextProps.mouseVector.x;
    //this.mouseParticle.y = nextProps.mouseVector.y;
    //this.mouseParticle.mass = DEFAULT_MOUSE_MASS;
  }

  render() {
    return (
      <div className='player-sc-image'>
        <canvas
          width={this.props.width}
          height={this.props.height}
          ref={(e) => this.canvas = e}
        />
      </div>);
  }

  renderImage (image) {
    let width = this.canvas.width / 4,
      height = this.canvas.height / 4;

    //this.image = image;
    this.ctx.drawImage(image, 0, 0, width, height);
    this.imageData = this.ctx.getImageData(0, 0, width, height);
  }

  createParticles () {
    const width = this.canvas.width,
      height = this.canvas.height;

    for (let x = 0; x < width / 4; x += 1) {
      for (let y = 0; y < height / 4; y += 1) {

        let particle = new Particle({
          color: this.getPixelColor(x, y),
          x: width / 2,
          y: height / 2,
          hx: x * SPACING,
          hy: y * SPACING,
          g: 0,
        });

        this.particles.push(particle);
      }
    }

    this.animate();
  }

  animate () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.isLoading) {
      this.animateInitial();
      if (this.isLoading) {
        requestAnimationFrame(() => this.animate());
      }
    }
    // else {
    //   this.mouseParticle.mass = this.mouseParticle.mass > 0 ? this.mouseParticle.mass -= 0.1 : 0;
    //   this.animateMouseMove();
    // }
  }

  animateInitial () {
    this.isLoading = false;
    this.particles.forEach((particle) => {
      let direction = {x: particle.hx - particle.x, y: particle.hy - particle.y},
        distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y),
        speed = Math.random() * (distance > 1 ? Math.min(distance, 100) : distance);

      direction = Particle.normalize(direction);
      direction.x = direction.x * speed;
      direction.y = direction.y * speed;

      particle.x += direction.x;
      particle.y += direction.y;

      this.isLoading = distance > 0;

      this.drawParticle(particle);
    });
  }

  animateMouseMove () {
    this.particles.forEach((p) => {
      p.rejection(this.mouseParticle);
      p.update();

      this.drawParticle(particle);
      if ((particle.x > this.props.width || particle.x < 0) &&
        (particle.y > this.props.height || particle.y < 0)) {
        particle.x = particle.hx;
        particle.y = particle.hy;
      }
    });
  }

  drawParticle (particle, reset) {
    let particleSize = 2;
    this.ctx.fillStyle = particle.color;
    this.ctx.fillRect(particle.x, particle.y, particleSize, particleSize);
  }

  getPixelColor (x, y) {
    let idx = ((this.imageData.width * y) + x ) * 4;
    return rgbToRgb(
      this.imageData.data[idx],
      this.imageData.data[idx + 1],
      this.imageData.data[idx + 2]);
  }

  handleResize(e) {
    const box = this.canvas.parentNode.getBoundingClientRect(),
      img = new Image();

    img.onload = () => {
      this.canvas.width = box.width;
      this.canvas.height = box.height;
      this.ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, box.width, box.height);
    }
    img.src = this.canvas.toDataURL();
  }
}

PlayerBackgroundImage.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  imageURL: React.PropTypes.string.isRequired,
  //mouseVector: React.PropTypes.object.isRequired
}
