import { TEMPOS } from './scripts/constant/tempos.js';

const MAX_BEATS = 8;

const tempoScaleBoard = document.querySelector('.metronome__tempo-scale-board');
const tempoSlider = document.querySelector('#tempo-slider');
const tempoSliderLabel = document.querySelector('label[for="tempo-slider"]')
const beatsSlider = document.querySelector('#beats-slider');
const beatsSliderLabel = document.querySelector('label[for="beats-slider"]')
const toggleMetronomeButton = document.querySelector('#toggle-metronome-button');

const pendulumElement = document.querySelector('#metronome__pendulum');
const slidingWeightElement = document.querySelector('.metronome__sliding-weight');
const beatKnobElement = document.querySelector('.metronome__beat-knob');
const windingKeyElement = document.querySelector('.metronome__winding-key');

let tempoScale = 120;
let beats = 1;
let isPlaying = false;

tempoScaleBoard.innerHTML = TEMPOS.map(tempo => `<span>${tempo}</span>`).join('');

tempoSlider.addEventListener("input", function(e) {
  const value = e.target.valueAsNumber;
  tempoScale = value;
  tempoSliderLabel.textContent = `${value} BPM`;
  const inputRange = Number(e.target.max) - Number(e.target.min);
  const weightPosition = ((value - Number(e.target.min)) / inputRange) * 75;

  slidingWeightElement.style.top = `${weightPosition}%`;
})

beatsSlider.addEventListener("input", function(e) {
  const value = e.target.value;
  beats = Number(value)
  beatsSliderLabel.textContent = `Beats: ${value}`;
  beatKnobElement.style.right = `${MAX_BEATS - beats}%`; /* Position is based on the beats value */
})




toggleMetronomeButton.addEventListener("click", function (e) {
  isPlaying = !isPlaying;
  if (isPlaying) {
    setButtonValues("STOP", "active")
    windingKeyElement.style.animation = "flip-forward 0.75s ease-out";
  }
  else {
    setButtonValues("START", "inactive")
    windingKeyElement.style.animation = "";
  }

  function setButtonValues(textContent, attributeValue) {
    toggleMetronomeButton.textContent = textContent
    toggleMetronomeButton.setAttribute("data-state", attributeValue)
  }
})

function setDefaultSettings() {
  tempoSlider.value = tempoScale;
  beatsSlider.value = beats;
}

setDefaultSettings();
