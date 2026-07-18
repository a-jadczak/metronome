import { PLAYBACK_STATE } from "../constant/settings.js";
import {
  beatsSlider,
  pendulumElement,
  tempoSlider,
  toggleMetronomeButton,
} from "../dom/elements.js";
import { playClick, prepareAudio } from "../services/audio-player.js";
import { metronome } from "./model.js";
import {
  renderBeats,
  renderPlaybackState,
  renderTempo,
  renderTempoScale,
} from "./view.js";

let metronomeInterval;
let currentBeatIndex = 0;

function setTempo(tempo) {
  metronome.tempo = tempo;
  renderTempo(tempo, metronome.getSecondsPerBeat());
}

function setBeats(beats) {
  metronome.beats = beats;
  renderBeats(beats);
}

function playCurrentBeat() {
  const clickType = currentBeatIndex === 0 ? "strong" : "light";

  playClick(clickType);
  currentBeatIndex = (currentBeatIndex + 1) % metronome.beats;
}

function stopMetronomeInterval() {
  clearInterval(metronomeInterval);
  metronomeInterval = undefined;
  currentBeatIndex = 0;
}

function startMetronomeInterval() {
  const millisecondsPerBeat = metronome.getSecondsPerBeat() * 1000;

  playCurrentBeat();
  metronomeInterval = setInterval(playCurrentBeat, millisecondsPerBeat);
}

function setPlaybackState(playbackState) {
  stopMetronomeInterval();
  metronome.playbackState = playbackState;

  if (playbackState === PLAYBACK_STATE.SWING) {
    startMetronomeInterval();
  }

  renderPlaybackState(playbackState);
}

function handleTempoInput(event) {
  setTempo(event.currentTarget.valueAsNumber);
}

function handleBeatsInput(event) {
  setBeats(event.currentTarget.valueAsNumber);
}

async function handlePlaybackToggle() {
  const nextState =
    metronome.playbackState === PLAYBACK_STATE.SWING
      ? PLAYBACK_STATE.RETURN
      : PLAYBACK_STATE.SWING;

  if (nextState === PLAYBACK_STATE.SWING) {
    try {
      await prepareAudio();
    } catch (error) {
      console.error("Could not prepare metronome audio:", error);
      return;
    }
  }

  setPlaybackState(nextState);
}

function handlePendulumAnimationIteration(event) {
  const shouldStopAtCenter =
    event.animationName === "pendulum-center-animation" &&
    metronome.playbackState === PLAYBACK_STATE.RETURN;

  if (shouldStopAtCenter) {
    setPlaybackState(PLAYBACK_STATE.IDLE);
  }
}

export function initializeMetronome() {
  renderTempoScale();
  setTempo(metronome.tempo);
  setBeats(metronome.beats);
  setPlaybackState(metronome.playbackState);

  tempoSlider.addEventListener("input", handleTempoInput);
  beatsSlider.addEventListener("input", handleBeatsInput);
  toggleMetronomeButton.addEventListener("click", handlePlaybackToggle);
  pendulumElement.addEventListener(
    "animationiteration",
    handlePendulumAnimationIteration,
  );
}
