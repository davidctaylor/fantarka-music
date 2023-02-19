import { Track } from "interfaces/index";

// For reasons unknown, SoundCloud no longer seems to support API's
// You need to create a SoundCloud app to get a key, buts its not possible to do so.
export const LOCAL_TRACKS: Track[] = [
  {
    title: "Backdraft",
    artwork_url: "./images/backdraft.jpg",
    stream_url: "./wave/backdraft.wav",
    description: "Uplifting EDM track to get the nights out going!",
  },
  {
    title: "Contour",
    artwork_url: "./images/fantarka.jpg",
    stream_url: "./wave/contour.wav",
    description: "EDM",
  },
  {
    title: "Herm",
    artwork_url: "./images/fantarka.jpg",
    stream_url: "./wave/herm.ma4",
    description: "Ambient track",
  },
  {
    title: "Solarium",
    artwork_url: "./images/solar.jpg",
    stream_url: "./wave/solarium.ma4",
    description: "Uplifting Old School style dance track with a modern twist!",
  },
];
