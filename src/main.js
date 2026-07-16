import { TEMPOS } from './scripts/constant/tempos.js';
import {
  DEFAULT_BEATS,
  DEFAULT_TEMPO,
  WEIGHT_TRAVEL_PERCENT,
  WINDING_KEY_ANIMATION,
} from './scripts/constant/settings.js';

const tempoScaleBoard = document.querySelector('.metronome__tempo-scale-board');
const tempoSlider = document.querySelector('#tempo-slider');
const tempoSliderLabel = document.querySelector('label[for="tempo-slider"]');
const beatsSlider = document.querySelector('#beats-slider');
const beatsSliderLabel = document.querySelector('label[for="beats-slider"]');
const toggleMetronomeButton = document.querySelector('#toggle-metronome-button');
const pendulumElement = document.querySelector('#metronome__pendulum');
const slidingWeightElement = document.querySelector('.metronome__sliding-weight');
const beatKnobElement = document.querySelector('.metronome__beat-knob');
const windingKeyElement = document.querySelector('.metronome__winding-key');

let metronomeInterval;

const state = {
  tempo: DEFAULT_TEMPO,
  beats: DEFAULT_BEATS,
  isPlaying: false,
  getSecondsPerBeat() {
    return 60 / this.tempo;
  }
};

function renderTempoScale() {
  tempoScaleBoard.innerHTML = TEMPOS
    .map((tempo) => `<span>${tempo}</span>`)
    .join('');
}

function getRangeProgress(input, value) {
  const min = Number(input.min);
  const max = Number(input.max);

  return (value - min) / (max - min);
}

function setTempo(tempo) {
  state.tempo = tempo;
  tempoSlider.value = tempo;
  tempoSliderLabel.textContent = `${tempo} BPM`;

  const weightPosition = getRangeProgress(tempoSlider, tempo) * WEIGHT_TRAVEL_PERCENT;
  const animationDuration = state.getSecondsPerBeat() * 2;

  slidingWeightElement.style.top = `${weightPosition}%`;
  pendulumElement.style.setProperty('--pendulum-swing-duration', `${animationDuration}s`);
}

function setBeats(beats) {
  state.beats = beats;
  beatsSlider.value = beats;
  beatsSliderLabel.textContent = `Beats: ${beats}`;

  const maxBeats = Number(beatsSlider.max);
  beatKnobElement.style.right = `${maxBeats - beats}%`;
}

function updatePlaybackUI(buttonText, buttonState, windingKeyAnimation) {
  toggleMetronomeButton.textContent = buttonText;
  toggleMetronomeButton.dataset.state = buttonState;
  pendulumElement.dataset.state = buttonState;
  windingKeyElement.style.animation = windingKeyAnimation;


}

function setPlayback(isPlaying) {
  state.isPlaying = isPlaying;
  tempoSlider.toggleAttribute('disabled', isPlaying);
  beatsSlider.toggleAttribute('disabled', isPlaying);

  if (isPlaying) {
    metronomeInterval = setInterval(function () {
      console.log(`Hey!`)
    }, state.getSecondsPerBeat() * 1000);
    updatePlaybackUI('STOP', 'active', WINDING_KEY_ANIMATION);
  }
  else {
    updatePlaybackUI('START', 'inactive', '');
    clearInterval(metronomeInterval)
  }
}

function initializeMetronome() {
  renderTempoScale();
  setTempo(state.tempo);
  setBeats(state.beats);
  setPlayback(state.isPlaying);

  tempoSlider.addEventListener('input', (e) => setTempo(e.currentTarget.valueAsNumber));
  beatsSlider.addEventListener('input', (e) => setBeats(e.currentTarget.valueAsNumber));
  toggleMetronomeButton.addEventListener('click', () => setPlayback(!state.isPlaying));
}

initializeMetronome();
