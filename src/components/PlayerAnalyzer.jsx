import React, { PropTypes} from 'react';
import { connect } from 'react-redux';

import {
  PLAYER_EVENT_INIT,
  PLAYER_STATE_IDLE,
  PLAYER_STATE_ACTIVE
} from '../actions/';

const mapStateToProps = (state) => {
  return {
    action: state.playerReducer.action,
    playerState: state.playerReducer.playerState,
    player: state.playerReducer.player,
  };
}

class PlayerAnalyzer extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.connect(this.audioContext.destination);
    this.analyser.fftSize = 128;
    this.dataArray = new Uint8Array(new Uint8Array(this.analyser.frequencyBinCount));
    this.xOffset = 0;
    this.yOffset = 0;
    this.counter = 0;
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'rgba(255, 85, 0, 1)';
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.action === PLAYER_EVENT_INIT) {
      const audioSrc = this.audioContext.createMediaElementSource(nextProps.player.audio);
      audioSrc.connect(this.analyser);

      this.xOffset = this.canvas.width / this.analyser.frequencyBinCount;
      this.yOffset = Math.round(this.canvas.height * 0.75);
    } else if (nextProps.playerState === PLAYER_STATE_ACTIVE) {
      this.ctx.strokeStyle = 'rgba(255, 85, 0, 1)';
      this.animate();
    } else if (nextProps.playerState === PLAYER_STATE_IDLE) {
      this.ctx.strokeStyle = 'rgba(255, 85, 0, 0.1)';
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  animate() {
    const bufferLen = this.analyser.frequencyBinCount;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.analyser.getByteTimeDomainData(this.dataArray);

    let x = 0;
    for (let i = 0; i < bufferLen; i++) {
      if (i === 0) {
        this.ctx.moveTo(x, this.yOffset);
        this.ctx.beginPath();
      } else {
        this.ctx.lineTo(x, this.yOffset - this.dataArray[i]);
      }

      x += this.xOffset;
    }

    this.ctx.stroke();
    this.ctx.closePath();
    //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.props.playerState === PLAYER_STATE_ACTIVE) {
      requestAnimationFrame(() => this.animate());
    }
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
