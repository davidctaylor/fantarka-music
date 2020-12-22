const SOUNDCLOUD_ARTIST_URL = 'https://soundcloud.com/fantarka';
export const rgbToString = (r: number, g: number, b: number, a: number): string => {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const handleOnShareEvent = (evt: any, type: string) => {
  switch (type) {
    case 'sound-cloud':
      window.open(SOUNDCLOUD_ARTIST_URL, '_blank');
      return;
    case 'email':
      window.location.href = 'mailto:fantarkamusic@gmail.com?subject=Fantarka Music';
      return;
  }
};
