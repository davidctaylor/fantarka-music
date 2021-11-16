import { Track } from "interfaces/index";

// For reasons unknown, SoundCloud no longer seems to support API's
// You need to create a SoundCloud app to get a key, buts its not possible to do so.
export const LOCAL_TRACKS: Track[] = [
  {
    title: "Touch",
    artwork_url: "./images/touch.jpg",
    stream_url: "./wave/touch.wav",
    description: "Slamming dance track with hammering rhythms from the get go",
  },
  {
    title: "Revolution",
    artwork_url: "./images/revolution.jpg",
    stream_url: "./wave/revolution.wav",
    description: "Slamming dance track with hammering rhythms from the get go",
  },
  {
    title: "Backdraft",
    artwork_url: "./images/backdraft.jpg",
    stream_url: "./wave/backdraft.wav",
    description: "Uplifting EDM track to get the nights out going!",
  },
  {
    title: "Revival",
    artwork_url: "./images/revival.jpg",
    stream_url: "./wave/revival.wav",
    description:
      "Draft track - need to check if Kick/Bass in in balance (not too boomy). Any other pointers welcome",
  },
  {
    title: "Solar",
    artwork_url: "./images/solar.jpg",
    stream_url: "./wave/solar.wav",
    description: "Uplifting Old School style dance track with a modern twist!",
  },
  {
    title: "Deep Dive",
    artwork_url: "./images/deep-dive.jpg",
    stream_url: "./wave/deep-dive.wav",
    description: "Uplifting grunge dance track!",
  },
  {
    title: "Herm",
    artwork_url: "./images/fantarka.jpg",
    stream_url: "./wave/herm.m4a",
    description: "Ambient track",
  },
];
