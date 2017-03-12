import React, { PropTypes} from 'react';
import { connect } from 'react-redux';

import {
  PLAYER_EVENT_INIT,
  PLAYER_STATE_IDLE,
  PLAYER_STATE_ACTIVE
} from '../actions/';

const BACKGROUND_COLOR = 'rgba(15, 14, 14, 0.5)';

const mapStateToProps = (state) => {
  return {
    action: state.playerReducer.action,
    playerState: state.playerReducer.playerState,
    player: state.playerReducer.player,
  };
}

const isSafariMobile = () => {
  return /iP(ad|hone|od).+Version\/[\d\.]+.*Safari/i.test(navigator.userAgent);
}

const fillColor = (alpha) => {
  return `rgba(19, 34, 94, ${!alpha ? 1 : alpha})`;
}

const LINE_COLORS = [
  '19, 34, 94',
  '54, 121, 156',
  '195, 188, 186',
  '57, 119, 192',
  '69, 160, 179'
]

const lineFillColor = (idx, alpha) => {
  return `rgba(${LINE_COLORS[idx]}, ${!alpha ? 1 : alpha})`;
}

const random = (min, max) => {
  return Math.random() * (max - min) + min;
}

const distance = (v1, v2) => {
  const dx = v1.x - v2.x,
    dy = v1.y - v2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

class PlayerAnalyzer extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.connect(this.audioContext.destination);
    this.analyser.fftSize = 128;
    this.dataArray = new Uint8Array(new Uint8Array(this.analyser.frequencyBinCount));
    this.yOffset = 0;
  }

  componentDidMount() {
    if (isSafariMobile()) {
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineCap = 'round';
  }

  componentWillReceiveProps(nextProps) {
    if (isSafariMobile()) {
      return;
    }

    if (nextProps.action === PLAYER_EVENT_INIT) {
      const audioSrc = this.audioContext.createMediaElementSource(nextProps.player.audio);
      audioSrc.connect(this.analyser);

      this.yOffset = Math.round(this.canvas.height * 0.5);
    } else if (nextProps.playerState === PLAYER_STATE_ACTIVE) {
      this.ctx.strokeStyle = fillColor(1);
      this.animate();
    } else if (nextProps.playerState === PLAYER_STATE_IDLE) {
      this.ctx.strokeStyle = fillColor(0.1);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  animate() {
    let points = [],
      width = this.canvas.width * 0.75,//  / 2,//random(1, 2),
      xOffset = width / this.analyser.frequencyBinCount,
      wOffset = ((this.canvas.width / 2) - (width / 2));

    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.globalCompositeOperation = 'lighter';

    this.analyser.getByteTimeDomainData(this.dataArray);

    this.dataArray.forEach((d, idx) => {
      let x = {
        x: (wOffset + (idx * xOffset)),
        y: (idx === 0 ? this.yOffset : this.yOffset - d)
      }
      points.push(x);
    });


    let i = Math.round(random(0, LINE_COLORS.length));
    this.drawLineBlur(points, 50, 30, lineFillColor(i, random(50, 30)));
    this.drawLine(points, lineFillColor(i, random(0.75, 1)));
    this.drawLineEnd(points[1]);
    this.drawLineEnd(points[ points.length -1 ]);

    if (this.props.playerState === PLAYER_STATE_ACTIVE) {
      requestAnimationFrame(() => this.animate());
    }
  }

  drawLine(points, color) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = random(1, 3);

    points.forEach((point, idx) => {
      if (idx === 0) {
        this.ctx.moveTo(point.x, point.y);
        this.ctx.beginPath();
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
    });

    this.ctx.stroke();
  }

  drawLineBlur(points, blur, maxSize, color) {
    const pLen = points.length;
    let dist = 0;

    this.ctx.save();
    this.ctx.shadowBlur = blur;
    this.ctx.shadowColor = color;

    points.forEach((point, idx) => {
      dist = pLen > 1 ? distance(point, points[idx === pLen - 1 ? idx - 1 : idx + 1]) : 0;
      if (dist > maxSize) {
        dist = maxSize
      };

      if (idx === 0) {
        this.ctx.beginPath();
        this.ctx.moveTo(point.x + dist, point.y);
      } else {
        this.ctx.moveTo(point.x + dist, point.y);
        this.ctx.arc(point.x, point.y, dist, 0, Math.PI * 2, false);
      }
    });

    this.ctx.fill();
    this.ctx.restore();
  }

  drawLineEnd(point) {
    let radius = 8,//random(3, 8),
      gradient = this.ctx.createRadialGradient(point.x, point.y, radius / 3, point.x, point.y, radius);

    gradient.addColorStop(0, fillColor(1));
    gradient.addColorStop(1, fillColor(0));

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, radius, 0, Math.PI * 2, false);
    this.ctx.fill();
  }

  render() {
    return (
      <div className='player-sc-analyzer'>
        <canvas
          width={this.props.width}
          height={this.props.height}
          ref={(e) => this.canvas = e}
        />
      </div>
    );
  }
};

PlayerAnalyzer.propTypes = {
}

export default connect(mapStateToProps)(PlayerAnalyzer);