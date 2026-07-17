import {
  BEAT_DIAL_MAX_ANGLE,
  BEAT_DIAL_MIN_ANGLE,
  PLAYBACK_STATE,
  WEIGHT_TRAVEL_PERCENT,
  WINDING_KEY_ANIMATION,
} from "../constant/settings.js";
import { TEMPOS } from "../constant/tempos.js";
import {
  beatKnobElement,
  beatsSlider,
  beatsSliderLabel,
  pendulumElement,
  slidingWeightElement,
  tempoScaleBoard,
  tempoSlider,
  tempoSliderLabel,
  toggleMetronomeButton,
  windingKeyElement,
} from "../dom/elements.js";
import { getRangeProgress } from "../utils/range.js";

const PLAYBACK_UI = Object.freeze({
  [PLAYBACK_STATE.IDLE]: {
    buttonText: "START",
    buttonState: "inactive",
    windingKeyAnimation: "",
  },
  [PLAYBACK_STATE.SWING]: {
    buttonText: "STOP",
    buttonState: "active",
    windingKeyAnimation: WINDING_KEY_ANIMATION,
  },
  [PLAYBACK_STATE.RETURN]: {
    buttonText: "WAIT",
    buttonState: "inactive",
    windingKeyAnimation: "",
  },
});

const TEMPO_SCALE_STEP = 2;

export function renderTempoScale() {
  tempoScaleBoard.innerHTML = TEMPOS.filter(
    (_, index) => index % TEMPO_SCALE_STEP === 0,
  )
    .map((tempo) => `<span><small>${tempo}</small></span>`)
    .join("");
}

export function renderTempo(tempo, secondsPerBeat) {
  const weightPosition =
    getRangeProgress(tempoSlider, tempo) * WEIGHT_TRAVEL_PERCENT;

  tempoSlider.value = tempo;
  tempoSliderLabel.textContent = `${tempo} BPM`;
  slidingWeightElement.style.top = `${weightPosition}%`;
  pendulumElement.style.setProperty(
    "--pendulum-swing-duration",
    `${secondsPerBeat * 2}s`,
  );
  pendulumElement.style.setProperty(
    "--pendulum-center-duration",
    `${secondsPerBeat}s`,
  );
}

export function renderBeats(beats) {
  const dialProgress = getRangeProgress(beatsSlider, beats);
  const rotationRange = BEAT_DIAL_MAX_ANGLE - BEAT_DIAL_MIN_ANGLE;
  const dialRotation = BEAT_DIAL_MIN_ANGLE + dialProgress * rotationRange;

  beatsSlider.value = beats;
  beatsSliderLabel.textContent = `Beats: ${beats}`;
  beatKnobElement.style.transform = `rotate(${dialRotation}deg)`;
}

export function renderPlaybackState(playbackState) {
  const { buttonText, buttonState, windingKeyAnimation } =
    PLAYBACK_UI[playbackState];
  const isAnimating = playbackState !== PLAYBACK_STATE.IDLE;
  const isReturning = playbackState === PLAYBACK_STATE.RETURN;

  pendulumElement.dataset.state = playbackState;
  tempoSlider.toggleAttribute("disabled", isAnimating);
  beatsSlider.toggleAttribute("disabled", isAnimating);
  toggleMetronomeButton.toggleAttribute("disabled", isReturning);
  toggleMetronomeButton.textContent = buttonText;
  toggleMetronomeButton.dataset.state = buttonState;
  windingKeyElement.style.animation = windingKeyAnimation;
}
