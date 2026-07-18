import {
  DEFAULT_BEATS,
  DEFAULT_TEMPO,
  DEFAULT_VOLUME,
  PLAYBACK_STATE,
} from '../constant/settings.js';

export const metronome = {
  tempo: DEFAULT_TEMPO,
  beats: DEFAULT_BEATS,
  volume: DEFAULT_VOLUME,
  playbackState: PLAYBACK_STATE.IDLE,
  getSecondsPerBeat() {
    return 60 / this.tempo;
  },
};
