import {
  DEFAULT_BEATS,
  DEFAULT_TEMPO,
  PLAYBACK_STATE,
} from '../constant/settings.js';

export const metronome = {
  tempo: DEFAULT_TEMPO,
  beats: DEFAULT_BEATS,
  playbackState: PLAYBACK_STATE.IDLE,
  getSecondsPerBeat() {
    return 60 / this.tempo;
  },
};
