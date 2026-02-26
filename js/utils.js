import { state } from './state.js';
import { timerElement, compCountElement, swapCountElement } from './constants.js';

export async function sleep(ms) {
    while (state.isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getDelay() {
    return state.speed * 2;
}

export function startTimer() {
    state.startTime = Date.now() - state.elapsedTime;
    state.timerInterval = setInterval(() => {
        state.elapsedTime = Date.now() - state.startTime;
        const seconds = (state.elapsedTime / 1000).toFixed(2);
        timerElement.textContent = 'Time: ' + seconds + 's';
    }, 10);
}

export function stopTimer() {
    clearInterval(state.timerInterval);
}

export function resetStats() {
    clearInterval(state.timerInterval);
    state.elapsedTime = 0;
    timerElement.textContent = 'Time: 0.00s';
    state.comparisons = 0;
    state.swaps = 0;
    updateStats();
}

export function updateStats() {
    compCountElement.textContent = 'Comparisons: ' + state.comparisons;
    swapCountElement.textContent = 'Swaps: ' + state.swaps;
}
