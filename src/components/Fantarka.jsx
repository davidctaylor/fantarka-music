import React, { PropTypes} from 'react';

import { connect } from 'react-redux';

import SC from 'soundcloud';

import { FantarkaImage } from './FantarkaImage';
import PlayerControls from './PlayerControls';

import {
  loadTracks,
  startTimer,
  PLAYER_SHUFFLE,
  setActiveState,
  setMouseVector,
} from '../actions/';

const mapStateToProps = (state) => {
  return {
    mouseVector: state.stateReducer.mouseVector,
  };
}

class Fantarka extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    SC.initialize({
      client_id: this.props.soundCloudClient,
      redirect_uri: 'http://localhost:3001'
    });
    setTimeout(() => {
      SC.get('/tracks', {
        user_id: this.props.soundCloudUserId,
        limit: 100
      }).then(tracks => {
        this.props.dispatch(loadTracks(tracks.map(track => {
          return {
            title: track.title,
            streamUrl: track.stream_url,
            id: track.id,
            progress: 0,
          };
        })));

      }, e => {
        console.log('XXX E:', e);
      });

      this.props.dispatch(startTimer(PLAYER_SHUFFLE, 5000));
    }, 2000);


    //console.log('XXX 1', SoundCloudAudio);
    //const scPlayer = new SoundCloudAudio(FANTARKA_CLIENT);
    //scPlayer.play({streamUrl: 'http://localhost:3100/beatles.mp3'});

    //this.setState({audioElement: scPlayer.audio});

    //this.hij(scPlayer.audio);

    //scPlayer.play({streamUrl: 'http://localhost:3100/beatles.mp3'});

    /*
    scPlayer.resolve('beatles.mp3', function (track) {
      // do smth with track object
      // e.g. display data in a view etc.
      console.log('XXX got track', track);

      // once track is loaded it can be played
      scPlayer.play();

      // stop playing track and keep silence
      scPlayer.pause();
    });
    */
     // create new instance of audio
  }
  /*

  componentDidMount() {
    var audioSource = new SoundCloudAudioSource('player');
    var canvasElement = document.getElementById('canvas');
    var context = canvasElement.getContext("2d");

    var draw = function () {
      // you can then access all the frequency and volume data
      // and use it to draw whatever you like on your canvas
      for (bin = 0; bin < audioSource.streamData.length; bin++) {
        // do something with each value. Here's a simple example
        var val = audioSource.streamData[bin];
        var red = val;
        var green = 255 - val;
        var blue = val / 2;
        context.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
        context.fillRect(bin * 2, 0, 2, 200);
        // use lines and shapes to draw to the canvas is various ways. Use your imagination!
      }
      requestAnimationFrame(draw);
    };

    audioSource.playStream('url_to_soundcloud_stream');
    draw();

  }

   */

  render() {
    return (
      <div className="fantarka-components"
           onMouseMove={(evt) => this.handleOnMove(evt)}>
        <div className="fantarka-header">Fantarka</div>
        <div className="fantarka-main">
          <FantarkaImage
            width={window.innerWidth}
            height={window.innerHeight}
            dispatch={this.props.dispatch}
            imageURL={this.props.imageURL}
            mouseVector={this.props.mouseVector}
            //audioElement={this.state.audioElement}
          />
          <div className='fantarka-controls-container'>
            <PlayerControls/>
          </div>
        </div>
        <div className="fantarka-footer">
          <img className="soundcloud-link"
               onClick={(evt) => this.handleOnClick(evt)}
               alt='Fantarka'
               src='https://w.soundcloud.com/icon/assets/images/orange_transparent_56-94fc761.png'/>
        </div>
      </div>
    );
  }

  hij (audioElement) {
    const ctx = new AudioContext(),
        analyser = ctx.createAnalyser();
    var source = ctx.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    //source.connect(context.destination);

    console.log('XXX a1:', audioElement);


    console.log(analyser.fftSize); // 2048 by default
    console.log(analyser.frequencyBinCount); // will give us 1024 data points

    analyser.fftSize = 328 / 2;
    console.log(analyser.frequencyBinCount);

    var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);

    for (var i = 0; i < frequencyData.length; i++) {
      console.log('XXX data:' + frequencyData[i]);
    }

    function update() {
      // Schedule the next update

      //console.log('XXX in update...', requestAnimationFrame);

      // Get the new frequency data
      analyser.getByteFrequencyData(frequencyData);

      for (var i = 0; i < frequencyData.length; i++) {
        console.log('XXX data:' + frequencyData[i]);
      }
      // Update the visualisation
      //bars.each(function (index, bar) {
      //bar.style.height = frequencyData[index] + 'px';
      //});

      requestAnimationFrame(update);
    };
  }

  handleOnMove(evt) {
    //this.props.dispatch(setMouseVector({x: evt.clientX, y: evt.clientY}));
  }

  handleOnClick(evt) {
    window.open('https://soundcloud.com/fantarka', '_blank');
  }
};

Fantarka.propTypes = {
  soundCloudClient: PropTypes.string.isRequired,
  soundCloudUserId: PropTypes.string.isRequired,
  imageURL: PropTypes.string.isRequired,
}

export default connect(mapStateToProps)(Fantarka);