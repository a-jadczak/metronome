import { TEMPOS } from './scripts/constant/tempos.js';

const tempoScaleBoard = document.querySelector('.metronome__tempo-scale-board');

tempoScaleBoard.innerHTML = TEMPOS.map(tempo => `<span>${tempo}</span>`).join('');
