import { TEMPOS } from './scripts/constant/tempos.js';
import {
  DEFAULT_BEATS,
  DEFAULT_TEMPO,
  WEIGHT_TRAVEL_PERCENT,
  WINDING_KEY_ANIMATION,
  PLAYBACK_STATE
} from './scripts/constant/settings.js';
import { getRangeProgress } from './scripts/utils/range.js';

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

const metronome = {
  tempo: DEFAULT_TEMPO,
  beats: DEFAULT_BEATS,
  playbackState: PLAYBACK_STATE.IDLE,
  getSecondsPerBeat() {
    return 60 / this.tempo;
  }
};

const playbackStateHandlers = {
  [PLAYBACK_STATE.IDLE]() {
    this.updatePlaybackUI('START', 'inactive', '');
  },
  [PLAYBACK_STATE.SWING]() {
    const miliSecondsPerBeat = metronome.getSecondsPerBeat() * 1000;
    metronomeInterval = setInterval(function () {
      console.log(`Hey!`)
    }, miliSecondsPerBeat);
    this.updatePlaybackUI('STOP', 'active', WINDING_KEY_ANIMATION);
  },
  [PLAYBACK_STATE.RETURN]() {
    this.updatePlaybackUI('WAIT', 'inactive', '');
  },
  updatePlaybackUI(buttonText, buttonState, windingKeyAnimation) {
    toggleMetronomeButton.textContent = buttonText;
    toggleMetronomeButton.dataset.state = buttonState;
    windingKeyElement.style.animation = windingKeyAnimation;
  }
}

function renderTempoScale() {
  tempoScaleBoard.innerHTML = TEMPOS
    .map((tempo) => `<span>${tempo}</span>`)
    .join('');
}

function setTempo(tempo) {
  metronome.tempo = tempo;
  tempoSlider.value = tempo;
  tempoSliderLabel.textContent = `${tempo} BPM`;

  const weightPosition = getRangeProgress(tempoSlider, tempo) * WEIGHT_TRAVEL_PERCENT;
  const secondsPerBeat = metronome.getSecondsPerBeat();

  slidingWeightElement.style.top = `${weightPosition}%`;
  pendulumElement.style.setProperty('--pendulum-swing-duration', `${secondsPerBeat * 2}s`);
  pendulumElement.style.setProperty('--pendulum-center-duration', `${secondsPerBeat}s`);
}

function setBeats(beats) {
  metronome.beats = beats;
  beatsSlider.value = beats;
  beatsSliderLabel.textContent = `Beats: ${beats}`;

  const maxBeats = Number(beatsSlider.max);
  beatKnobElement.style.right = `${maxBeats - beats}%`;
}

function setPlaybackState(playbackState) {
  metronome.playbackState = playbackState;
  pendulumElement.dataset.state = playbackState;

  updateSettingsAccessibilityUI(playbackState);

  clearInterval(metronomeInterval);
  playbackStateHandlers[playbackState]();
}

function updateSettingsAccessibilityUI(playbackState) {
  const isAnimating = playbackState !== PLAYBACK_STATE.IDLE;
  const isReturning = playbackState === PLAYBACK_STATE.RETURN;

  tempoSlider.toggleAttribute('disabled', isAnimating);
  beatsSlider.toggleAttribute('disabled', isAnimating);
  toggleMetronomeButton.toggleAttribute('disabled', isReturning);
}

function togglePlaybackState() {
  const nextState = metronome.playbackState === PLAYBACK_STATE.SWING
    ? PLAYBACK_STATE.RETURN
    : PLAYBACK_STATE.SWING;

  setPlaybackState(nextState);
}

function handlePendulumAnimationIteration(event) {
  if (event.animationName !== 'pendulum-center-animation') {
    return;
  }

  if (metronome.playbackState === PLAYBACK_STATE.RETURN) {
    setPlaybackState(PLAYBACK_STATE.IDLE);
  }
}

function initializeMetronome() {
  renderTempoScale();
  setTempo(metronome.tempo);
  setBeats(metronome.beats);
  setPlaybackState(metronome.playbackState);

  tempoSlider.addEventListener('input', (e) => setTempo(e.currentTarget.valueAsNumber));
  beatsSlider.addEventListener('input', (e) => setBeats(e.currentTarget.valueAsNumber));
  toggleMetronomeButton.addEventListener('click', togglePlaybackState);

  pendulumElement.addEventListener('animationiteration', handlePendulumAnimationIteration);
}

initializeMetronome();
