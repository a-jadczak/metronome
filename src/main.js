import { TEMPOS } from './scripts/constant/tempos.js';

const tempoScaleBoard = document.querySelector('.metronome__tempo-scale-board');
console.log(tempoScaleBoard)

tempoScaleBoard.innerHTML = TEMPOS.map(tempo => `<span>${tempo}</span>`).join('');
