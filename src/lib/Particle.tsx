export interface ParticleProps {
  color: string;
  x: number;
  y: number;
  hx: number;
  hy: number;
  // vx: number;
  // vy: number;
  // mass: number;
  // friction: number;
  // gravity: number;
}

export interface ParticlePos {
  x: number, y: number
}

export class Particle {
  public color: string;
  public x: number;
  public y: number;
  public hx: number;
  public hy: number;
  public vx: number;
  public vy: number;
  public mass: number;
  public friction: number;
  public gravity: number;

  constructor(props: ParticleProps) {
    let speed = 1.5;// / 2, 10
    this.color = props.color;
    this.x = props.x;
    this.y = props.y;
    this.hx = props.hx;
    this.hy = props.hy;
    this.vx = 0; //Math.cos(Math.PI / 2) * speed;
    this.vy = Math.sin(Math.PI / 2) * speed;
    this.mass = 1;
    this.friction = 1;
    this.gravity = 0 / -Math.PI / 2;//properties.gravity || 0;
  }

  update() {
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
  }

  static lerp (v1: ParticlePos, v2: ParticlePos, alpha: number) {
    v1.x += ( v2.x - v1.x ) * alpha;
    v1.y += ( v2.y - v1.y ) * alpha;
  }

  static normalize(p: ParticlePos) {
    const m = Math.sqrt(p.x * p.x + p.y * p.y);
    if (m > 0) {
      p.x = p.x / m;
      p.y = p.y / m;
    }
    return p;
  }

  add(v: ParticlePos) {
    return {x: this.x + v.x, y: this.y + v.y};
  }

  sub(v: ParticlePos) {
    return {x: this.x - v.x, y: this.y - v.y};
  }

  static divide(v1: ParticlePos, v2: ParticlePos) {
    return {x: v1.x / v2.x, y: v1.y / v2.y };
  }

  static multiply(v1: ParticlePos, v2: ParticlePos) {
    return {x: v1.x * v2.x, y: v1.y * v2.y};
  }

  // magnitude
  distanceTo(v: ParticlePos) {
    const dx = this.x - v.x,
      dy = this.y - v.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  magnitude(v: ParticlePos) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  getSpeed () {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  }

  setSpeed(speed: number) {
    const heading = this.getHeading();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  }

  getHeading() {
    return Math.atan2(this.vy, this.vx);
  }

  setHeading(heading: number) {
    const speed = this.getSpeed();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  }

  accelerate(ax: number, ay: number) {
    this.vx += ax;
    this.vy += ay;
  }

  ease(v: ParticlePos) {
    let dx = v.x - this.x,
      dy = v.y - this.y;

    this.vx = dx * 0.05;
    this.vy = dy * 0.05;
  }

  angleTo(p: ParticlePos) {
    return Math.atan2(p.y - this.y, p.x - this.x);
  }

  // rejection (p: ParticleProps) {
  //   let dx = this.x - p.x,
  //     dy = this.y - p.y,
  //     distance = Math.sqrt(dx * dx + dy * dy),
  //     force = (1 * this.mass * p.mass * (p.mass === 10 ? 1 : -1)) / (distance * distance),
  //     ax = dx / distance * force,
  //     ay = dy / distance * force;
  //
  //   if (ax >= 0.001 || ax <= -0.001 || ay >= 0.001 || ay <= -0.001) {
  //     this.vx += ax;
  //     this.vy += ay;
  //   } else {
  //     this.vx = 0;
  //     this.vy = 0;
  //     if (p.mass <= 10) {
  //       this.ease({x: this.hx, y: this.hy});
  //     }
  //   }
  // }
}
