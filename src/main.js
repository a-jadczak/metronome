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
const slidingWeightElement = document.querySelector('.metronome__sliding-weight');
const beatKnobElement = document.querySelector('.metronome__beat-knob');
const windingKeyElement = document.querySelector('.metronome__winding-key');

const state = {
  tempo: DEFAULT_TEMPO,
  beats: DEFAULT_BEATS,
  isPlaying: false,
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
  slidingWeightElement.style.top = `${weightPosition}%`;
}

function setBeats(beats) {
  state.beats = beats;
  beatsSlider.value = beats;
  beatsSliderLabel.textContent = `Beats: ${beats}`;

  const maxBeats = Number(beatsSlider.max);
  beatKnobElement.style.right = `${maxBeats - beats}%`;
}

function setPlayback(isPlaying) {
  state.isPlaying = isPlaying;
  toggleMetronomeButton.textContent = isPlaying ? 'STOP' : 'START';
  toggleMetronomeButton.dataset.state = isPlaying ? 'active' : 'inactive';
  windingKeyElement.style.animation = isPlaying ? WINDING_KEY_ANIMATION : '';
}

function handleTempoInput(event) {
  setTempo(event.currentTarget.valueAsNumber);
}

function handleBeatsInput(event) {
  setBeats(event.currentTarget.valueAsNumber);
}

function handlePlaybackToggle() {
  setPlayback(!state.isPlaying);
}

function initializeMetronome() {
  renderTempoScale();
  setTempo(state.tempo);
  setBeats(state.beats);
  setPlayback(state.isPlaying);

  tempoSlider.addEventListener('input', handleTempoInput);
  beatsSlider.addEventListener('input', handleBeatsInput);
  toggleMetronomeButton.addEventListener('click', handlePlaybackToggle);
}

initializeMetronome();
