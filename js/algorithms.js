import { state } from './state.js';
import { playNote } from './audio.js';
import { sleep, getDelay, updateStats, stopTimer } from './utils.js';
import { startBtn, generateBtn, algoSelect, dataSelect, stopBtn, statusText } from './constants.js';

export async function bubbleSort() {
    state.isSorting = true;
    startBtn.disabled = true;
    generateBtn.disabled = true;
    algoSelect.disabled = true;
    dataSelect.disabled = true;
    stopBtn.disabled = false;

    const bars = document.getElementsByClassName('bar');

    for (let i = 0; i < state.array.length; i++) {
        for (let j = 0; j < state.array.length - i - 1; j++) {
            bars[j].classList.add('compare');
            bars[j + 1].classList.add('compare');

            playNote(state.array[j]);
            await sleep(getDelay());

            state.comparisons++;
            updateStats();

            if (state.array[j] > state.array[j + 1]) {
                let temp = state.array[j];
                state.array[j] = state.array[j + 1];
                state.array[j + 1] = temp;

                bars[j].style.height = state.array[j] + '%';
                bars[j + 1].style.height = state.array[j + 1] + '%';

                playNote(state.array[j]);
                state.swaps++;
                updateStats();
            }

            bars[j].classList.remove('compare');
            bars[j + 1].classList.remove('compare');
        }
        bars[state.array.length - i - 1].classList.add('sorted');
    }
    for (let k = 0; k < bars.length; k++) {
        bars[k].classList.add('sorted');
    }

    await finishSorting();
}

export async function runQuickSort() {
    state.isSorting = true;
    startBtn.disabled = true;
    generateBtn.disabled = true;
    algoSelect.disabled = true;
    dataSelect.disabled = true;
    stopBtn.disabled = false;

    await quickSort(0, state.array.length - 1);

    const bars = document.getElementsByClassName('bar');
    for (let k = 0; k < bars.length; k++) {
        bars[k].classList.add('sorted');
    }

    await finishSorting();
}

async function quickSort(start, end) {
    if (start < end) {
        let pivotIndex = await partition(start, end);
        await quickSort(start, pivotIndex - 1);
        await quickSort(pivotIndex + 1, end);
    }
}

async function partition(start, end) {
    const bars = document.getElementsByClassName('bar');
    let pivotValue = state.array[end];
    let pivotIndex = start;

    bars[end].classList.add('pivot');

    for (let i = start; i < end; i++) {
        bars[i].classList.add('compare');
        playNote(state.array[i]);
        await sleep(getDelay());

        state.comparisons++;
        updateStats();

        if (state.array[i] < pivotValue) {
            let temp = state.array[i];
            state.array[i] = state.array[pivotIndex];
            state.array[pivotIndex] = temp;

            bars[i].style.height = state.array[i] + '%';
            bars[pivotIndex].style.height = state.array[pivotIndex] + '%';

            playNote(state.array[i]);
            state.swaps++;
            updateStats();

            pivotIndex++;
        }

        bars[i].classList.remove('compare');
    }

    let temp = state.array[pivotIndex];
    state.array[pivotIndex] = state.array[end];
    state.array[end] = temp;

    bars[pivotIndex].style.height = state.array[pivotIndex] + '%';
    bars[end].style.height = state.array[end] + '%';

    playNote(state.array[pivotIndex]);
    state.swaps++;
    updateStats();

    bars[end].classList.remove('pivot');

    return pivotIndex;
}

export async function runMergeSort() {
    state.isSorting = true;
    startBtn.disabled = true;
    generateBtn.disabled = true;
    algoSelect.disabled = true;
    dataSelect.disabled = true;
    stopBtn.disabled = false;

    await mergeSort(0, state.array.length - 1);

    const bars = document.getElementsByClassName('bar');
    for (let k = 0; k < bars.length; k++) {
        bars[k].classList.add('sorted');
    }

    await finishSorting();
}

async function mergeSort(start, end) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);

    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    const bars = document.getElementsByClassName('bar');

    for (let i = start; i <= mid; i++) {
        bars[i].classList.add('merge-left');
    }
    for (let i = mid + 1; i <= end; i++) {
        bars[i].classList.add('merge-right');
    }

    await sleep(getDelay());

    let left = state.array.slice(start, mid + 1);
    let right = state.array.slice(mid + 1, end + 1);

    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
        bars[start + i].classList.add('compare');
        bars[mid + 1 + j].classList.add('compare');
        playNote(left[i]);
        await sleep(getDelay());

        state.comparisons++;
        updateStats();

        if (left[i] <= right[j]) {
            state.array[k] = left[i];
            bars[k].style.height = state.array[k] + '%';
            bars[k].classList.add('sorted');
            playNote(state.array[k]);
            i++;
        } else {
            state.array[k] = right[j];
            bars[k].style.height = state.array[k] + '%';
            bars[k].classList.add('sorted');
            playNote(state.array[k]);
            j++;
        }

        state.swaps++;
        updateStats();

        bars[start + i] ? bars[start + i].classList.remove('compare') : null;
        bars[mid + 1 + j] ? bars[mid + 1 + j].classList.remove('compare') : null;

        await sleep(getDelay() / 2);
        bars[k].classList.remove('sorted');
        k++;
    }

    while (i < left.length) {
        state.array[k] = left[i];
        bars[k].style.height = state.array[k] + '%';
        bars[k].classList.add('sorted');
        playNote(state.array[k]);
        state.swaps++;
        updateStats();
        await sleep(getDelay() / 2);
        bars[k].classList.remove('sorted');
        i++;
        k++;
    }

    while (j < right.length) {
        state.array[k] = right[j];
        bars[k].style.height = state.array[k] + '%';
        bars[k].classList.add('sorted');
        playNote(state.array[k]);
        state.swaps++;
        updateStats();
        await sleep(getDelay() / 2);
        bars[k].classList.remove('sorted');
        j++;
        k++;
    }

    for (let x = start; x <= end; x++) {
        bars[x].classList.remove('merge-left');
        bars[x].classList.remove('merge-right');
    }
}

export async function insertionSort() {
    state.isSorting = true;
    startBtn.disabled = true;
    generateBtn.disabled = true;
    algoSelect.disabled = true;
    dataSelect.disabled = true;
    stopBtn.disabled = false;

    const bars = document.getElementsByClassName('bar');

    bars[0]?.classList.add('sorted');

    for (let i = 1; i < state.array.length; i++) {
        let j = i;

        bars[j].classList.add('insertion-compare');
        await sleep(getDelay());

        while (j > 0 && state.array[j] < state.array[j - 1]) {
            state.comparisons++;
            updateStats();
            playNote(state.array[j]);

            let temp = state.array[j];
            state.array[j] = state.array[j - 1];
            state.array[j - 1] = temp;

            bars[j].style.height = state.array[j] + '%';
            bars[j - 1].style.height = state.array[j - 1] + '%';

            bars[j].classList.remove('insertion-compare');
            bars[j].classList.add('sorted');
            bars[j - 1].classList.add('insertion-compare');

            state.swaps++;
            updateStats();
            playNote(state.array[j - 1]);

            await sleep(getDelay());
            j--;
        }

        bars[j].classList.remove('insertion-compare');
        bars[j].classList.add('sorted');

        for (let k = 0; k <= i; k++) {
            bars[k].classList.add('sorted');
        }
    }

    await finishSorting();
}

export async function selectionSort() {
    state.isSorting = true;
    startBtn.disabled = true;
    generateBtn.disabled = true;
    algoSelect.disabled = true;
    dataSelect.disabled = true;
    stopBtn.disabled = false;

    const bars = document.getElementsByClassName('bar');

    for (let i = 0; i < state.array.length; i++) {
        let minIdx = i;
        bars[minIdx].classList.add('selection-min');

        for (let j = i + 1; j < state.array.length; j++) {
            bars[j].classList.add('compare');
            playNote(state.array[j]);
            await sleep(getDelay());

            state.comparisons++;
            updateStats();

            if (state.array[j] < state.array[minIdx]) {
                bars[minIdx].classList.remove('selection-min');
                minIdx = j;
                bars[minIdx].classList.add('selection-min');
                playNote(state.array[minIdx]);
            }

            bars[j].classList.remove('compare');
        }

        if (minIdx !== i) {
            let temp = state.array[i];
            state.array[i] = state.array[minIdx];
            state.array[minIdx] = temp;

            bars[i].style.height = state.array[i] + '%';
            bars[minIdx].style.height = state.array[minIdx] + '%';

            state.swaps++;
            updateStats();
            playNote(state.array[i]);
        }

        bars[minIdx].classList.remove('selection-min');
        bars[i].classList.add('sorted');
    }

    await finishSorting();
}

export async function heapSort() {
    state.isSorting = true;
    startBtn.disabled = true;
    generateBtn.disabled = true;
    algoSelect.disabled = true;
    dataSelect.disabled = true;
    stopBtn.disabled = false;

    const bars = document.getElementsByClassName('bar');
    const n = state.array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        bars[0].classList.add('heap-swap');
        bars[i].classList.add('heap-swap');
        playNote(state.array[0]);
        await sleep(getDelay());

        let temp = state.array[0];
        state.array[0] = state.array[i];
        state.array[i] = temp;

        bars[0].style.height = state.array[0] + '%';
        bars[i].style.height = state.array[i] + '%';

        state.swaps++;
        updateStats();
        playNote(state.array[i]);

        bars[0].classList.remove('heap-swap');
        bars[i].classList.remove('heap-swap');

        bars[i].classList.add('heap-sorted');

        await heapify(i, 0);
    }

    bars[0].classList.add('heap-sorted');

    await finishSorting();
}

async function heapify(n, i) {
    const bars = document.getElementsByClassName('bar');
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    bars[i].classList.add('compare');
    if (left < n) bars[left].classList.add('compare');
    if (right < n) bars[right].classList.add('compare');

    await sleep(getDelay());

    if (left < n) {
        state.comparisons++;
        updateStats();
        if (state.array[left] > state.array[largest]) {
            largest = left;
        }
    }

    if (right < n) {
        state.comparisons++;
        updateStats();
        if (state.array[right] > state.array[largest]) {
            largest = right;
        }
    }

    bars[i].classList.remove('compare');
    if (left < n) bars[left].classList.remove('compare');
    if (right < n) bars[right].classList.remove('compare');

    if (largest !== i) {
        let temp = state.array[i];
        state.array[i] = state.array[largest];
        state.array[largest] = temp;

        bars[i].style.height = state.array[i] + '%';
        bars[largest].style.height = state.array[largest] + '%';

        state.swaps++;
        updateStats();
        playNote(state.array[i]);

        await heapify(n, largest);
    }
}

export async function finishSorting() {
    stopTimer();
    statusText.textContent = algoSelect.options[algoSelect.selectedIndex].text + ' Completed!';
    stopBtn.disabled = true;
    stopBtn.textContent = 'Stop';
    state.isPaused = false;

    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < bars.length; i++) {
        bars[i].classList.remove('sorted');
        bars[i].classList.remove('heap-sorted');
        bars[i].classList.add('finished');
        playNote(state.array[i]);
        await sleep(20);
    }

    state.isSorting = false;
    generateBtn.disabled = false;
    algoSelect.disabled = false;
    dataSelect.disabled = false;
}
