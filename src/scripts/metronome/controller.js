import { PLAYBACK_STATE } from '../constant/settings.js';
import {
  beatsSlider,
  pendulumElement,
  tempoSlider,
  toggleMetronomeButton,
} from '../dom/elements.js';
import { metronome } from './model.js';
import {
  renderBeats,
  renderPlaybackState,
  renderTempo,
  renderTempoScale,
} from './view.js';

let metronomeInterval;

function startMetronomeInterval() {
  const millisecondsPerBeat = metronome.getSecondsPerBeat() * 1000;

  metronomeInterval = setInterval(() => {
    console.log('Hey!');
  }, millisecondsPerBeat);
}

function setPlaybackState(playbackState) {
  clearInterval(metronomeInterval);
  metronome.playbackState = playbackState;

  if (playbackState === PLAYBACK_STATE.SWING) {
    startMetronomeInterval();
  }

  renderPlaybackState(playbackState);
}

function handleTempoInput(event) {
  metronome.tempo = event.currentTarget.valueAsNumber;
  renderTempo(tempo, metronome.getSecondsPerBeat());
}

function handleBeatsInput(event) {
  metronome.beats = event.currentTarget.valueAsNumber;
  renderBeats(beats);
}

function handlePlaybackToggle() {
  const nextState = metronome.playbackState === PLAYBACK_STATE.SWING
    ? PLAYBACK_STATE.RETURN
    : PLAYBACK_STATE.SWING;

  setPlaybackState(nextState);
}

function handlePendulumAnimationIteration(event) {
  const shouldStopAtCenter = event.animationName === 'pendulum-center-animation'
    && metronome.playbackState === PLAYBACK_STATE.RETURN;

  if (shouldStopAtCenter) {
    setPlaybackState(PLAYBACK_STATE.IDLE);
  }
}

export function initializeMetronome() {
  renderTempoScale();
  setTempo(metronome.tempo);
  setBeats(metronome.beats);
  setPlaybackState(metronome.playbackState);

  tempoSlider.addEventListener('input', handleTempoInput);
  beatsSlider.addEventListener('input', handleBeatsInput);
  toggleMetronomeButton.addEventListener('click', handlePlaybackToggle);
  pendulumElement.addEventListener('animationiteration', handlePendulumAnimationIteration);
}
