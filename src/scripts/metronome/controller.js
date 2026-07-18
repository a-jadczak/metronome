import { PLAYBACK_STATE } from "../constant/settings.js";
import {
  beatsSlider,
  pendulumElement,
  tempoSlider,
  toggleMetronomeButton,
  volumeSlider,
} from "../dom/elements.js";
import {
  playClick,
  prepareAudio,
  prepareBuffers,
  setOutputVolume,
} from "../services/audio-player.js";
import { metronome } from "./model.js";
import {
  renderBeats,
  renderPlaybackState,
  renderTempo,
  renderTempoScale,
  renderVolume,
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

function setVolume(volume) {
  metronome.volume = volume;
  setOutputVolume(volume);
  renderVolume(volume);
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

function handleVolumeInput(event) {
  setVolume(event.currentTarget.valueAsNumber);
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

export async function initializeMetronome() {
  await prepareBuffers();
  renderTempoScale();
  setTempo(metronome.tempo);
  setBeats(metronome.beats);
  setVolume(metronome.volume);
  setPlaybackState(metronome.playbackState);

  tempoSlider.addEventListener("input", handleTempoInput);
  beatsSlider.addEventListener("input", handleBeatsInput);
  volumeSlider.addEventListener("input", handleVolumeInput);
  toggleMetronomeButton.addEventListener("click", handlePlaybackToggle);
  pendulumElement.addEventListener(
    "animationiteration",
    handlePendulumAnimationIteration,
  );
}
