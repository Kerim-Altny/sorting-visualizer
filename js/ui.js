import { state } from './state.js';
import {
    container, generateBtn, startBtn, stopBtn, muteBtn,
    speedSlider, algoSelect, dataSelect, algoTitle,
    algoComplexity, algoText, algoApps, algoBest,
    algoDescriptions
} from './constants.js';
import { resetStats, startTimer, stopTimer, updateStats } from './utils.js';
import {
    bubbleSort, runQuickSort, runMergeSort,
    insertionSort, selectionSort, heapSort
} from './algorithms.js';

export function updateDescription(algo) {
    const data = algoDescriptions[algo];
    algoTitle.textContent = data.title;
    algoComplexity.textContent = data.complexity;
    algoText.textContent = data.text;
    algoApps.textContent = data.apps;
    algoBest.textContent = data.best;
}

export function generateArray() {
    container.innerHTML = '';
    state.array = [];
    const numBars = 50;
    const type = dataSelect.value;

    if (type === 'random') {
        for (let i = 0; i < numBars; i++) {
            const value = Math.floor(Math.random() * 90) + 5;
            state.array.push(value);
        }
    } else if (type === 'reversed') {
        for (let i = 0; i < numBars; i++) {
            const value = 95 - (i * (90 / numBars));
            state.array.push(Math.floor(value));
        }
    } else if (type === 'nearly') {
        for (let i = 0; i < numBars; i++) {
            const value = 5 + (i * (90 / numBars));
            state.array.push(Math.floor(value));
        }
        for (let k = 0; k < 6; k++) {
            const idx1 = Math.floor(Math.random() * numBars);
            const idx2 = Math.floor(Math.random() * numBars);
            let temp = state.array[idx1];
            state.array[idx1] = state.array[idx2];
            state.array[idx2] = temp;
        }
    }

    for (let i = 0; i < numBars; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = state.array[i] + '%';
        container.appendChild(bar);
    }
}

export function init() {
    generateArray();
    updateDescription('bubble');

    generateBtn.addEventListener('click', () => {
        if (!state.isSorting) {
            generateArray();
            resetStats();
            startBtn.disabled = false;
            stopBtn.disabled = true;
            stopBtn.textContent = 'Stop';
            state.isPaused = false;
        }
    });

    startBtn.addEventListener('click', () => {
        if (!state.isSorting) {
            if (!state.audioCtx) {
                state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            resetStats();
            startTimer();
            const algo = algoSelect.value;
            if (algo === 'bubble') {
                bubbleSort();
            } else if (algo === 'quick') {
                runQuickSort();
            } else if (algo === 'merge') {
                runMergeSort();
            } else if (algo === 'insertion') {
                insertionSort();
            } else if (algo === 'selection') {
                selectionSort();
            } else if (algo === 'heap') {
                heapSort();
            }
        }
    });

    stopBtn.addEventListener('click', () => {
        if (state.isSorting) {
            if (state.isPaused) {
                state.isPaused = false;
                stopBtn.textContent = 'Stop';
                startTimer();
            } else {
                state.isPaused = true;
                stopBtn.textContent = 'Resume';
                stopTimer();
            }
        }
    });

    muteBtn.addEventListener('click', () => {
        state.isMuted = !state.isMuted;
        muteBtn.textContent = state.isMuted ? 'Unmute' : 'Mute';
    });

    speedSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        state.speed = 101 - val;
    });

    algoSelect.addEventListener('change', (e) => {
        updateDescription(e.target.value);
    });

    window.addEventListener('resize', () => {
        if (!state.isSorting) generateArray();
    });
}
