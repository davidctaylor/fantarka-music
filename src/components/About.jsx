import React from 'react';

export const About = (props) => (
  <div className={`player-sc-about ${props.aboutActive ? 'visible' : 'hidden'}`}>
    <div className='content'>
      <p>
        Fantarka produces electronic dance and ambient music plus customized 80s and 90s electro pop.
        Check out our track selection.
      </p>
      <p>
        Originally from the UK, Fantarka is now based in Washington, D.C., USA.
      </p>
      <p>
        Contact us at <span>Fantarkamusic@gmail.com</span> for purchasing from
        our library or customized tracks.
      </p>
    </div>
  </div>
);