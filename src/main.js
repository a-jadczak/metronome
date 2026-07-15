import { TEMPOS } from './scripts/constant/tempos.js';

const tempoScaleBoard = document.querySelector('.metronome__tempo-scale-board');
const tempoSlider = document.querySelector('#tempo-slider');
const tempoSliderLabel = document.querySelector('label[for="tempo-slider"]')
const beatsSlider = document.querySelector('#beats-slider');
const beatsSliderLabel = document.querySelector('label[for="beats-slider"]')
const toggleMetronomeButton = document.querySelector('#toggle-metronome-button');

let tempoScale = 120;
let beats = 1;
let isPlaying = false;

tempoScaleBoard.innerHTML = TEMPOS.map(tempo => `<span>${tempo}</span>`).join('');

tempoSlider.addEventListener("input", function(e) {
  const value = e.target.value;
  tempoScale = Number(value);
  tempoSliderLabel.textContent = `${value} BPM`;
})

beatsSlider.addEventListener("input", function(e) {
  const value = e.target.value;
  beats = Number(value)
  beatsSliderLabel.textContent = `Beats: ${value}`;
})

toggleMetronomeButton.addEventListener("click", function (e) {
  isPlaying = !isPlaying;
  toggleMetronomeButton.textContent = isPlaying ? "STOP" : "START"
})

function setDefaultSettings() {
  tempoSlider.value = tempoScale;
  beatsSlider.value = beats;
}

setDefaultSettings();
