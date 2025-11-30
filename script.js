const container = document.getElementById('visualizer-container');
const generateBtn = document.getElementById('generate-btn');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const muteBtn = document.getElementById('mute-btn');
const speedSlider = document.getElementById('speed-slider');
const timerElement = document.getElementById('timer');
const statusText = document.getElementById('status-text');
const algoSelect = document.getElementById('algo-select');
const dataSelect = document.getElementById('data-select');
const compCountElement = document.getElementById('comp-count');
const swapCountElement = document.getElementById('swap-count');
const algoTitle = document.getElementById('algo-title');
const algoComplexity = document.getElementById('algo-complexity');
const algoText = document.getElementById('algo-text');
const algoApps = document.getElementById('algo-apps');
const algoBest = document.getElementById('algo-best');

let array = [];
let isSorting = false;
let isPaused = false;
let isMuted = false;
let speed = 50;
let timerInterval;
let startTime;
let elapsedTime = 0;
let comparisons = 0;
let swaps = 0;
let lastPlayedTime = 0;

// Web Audio API Context
let audioCtx = null;

const algoDescriptions = {
    bubble: {
        title: 'Bubble Sort',
        complexity: 'O(n²)',
        text: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. It is known for its simplicity but is inefficient for large lists.',
        apps: 'Educational purposes, computer graphics (detecting small errors).',
        best: 'Small datasets, nearly sorted data, teaching sorting concepts.'
    },
    quick: {
        title: 'Quick Sort',
        complexity: 'O(n log n)',
        text: 'Quick Sort is a highly efficient divide-and-conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot. It is one of the fastest sorting algorithms in practice.',
        apps: 'Commercial computing, language standard libraries (e.g., C++ std::sort), large datasets.',
        best: 'Large datasets, arrays (good cache locality), when average-case performance matters.'
    },
    merge: {
        title: 'Merge Sort',
        complexity: 'O(n log n)',
        text: 'Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves. It guarantees O(n log n) time complexity.',
        apps: 'E-commerce applications, external sorting (large data that doesn\'t fit in memory).',
        best: 'Linked lists, large datasets, stable sorting requirements.'
    },
    insertion: {
        title: 'Insertion Sort',
        complexity: 'O(n²)',
        text: 'Insertion Sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
        apps: 'Small datasets, nearly sorted data.',
        best: 'Small datasets, online algorithms (data arrives one by one).'
    },
    selection: {
        title: 'Selection Sort',
        complexity: 'O(n²)',
        text: 'Selection Sort divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items.',
        apps: 'Simple sorting where memory writes are expensive.',
        best: 'Small lists, checking if everything is already sorted.'
    }
};

function init() {
    generateArray();
    updateDescription('bubble');

    generateBtn.addEventListener('click', () => {
        if (!isSorting) {
            generateArray();
            resetStats();
            startBtn.disabled = false;
            stopBtn.disabled = true;
            stopBtn.textContent = 'Stop';
            isPaused = false;
        }
    });
    startBtn.addEventListener('click', () => {
        if (!isSorting) {
            // Initialize Audio Context on user interaction
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            resetStats();
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
            }
        }
    });
    stopBtn.addEventListener('click', () => {
        if (isSorting) {
            if (isPaused) {
                isPaused = false;
                stopBtn.textContent = 'Stop';
                startTimer();
            } else {
                isPaused = true;
                stopBtn.textContent = 'Resume';
                stopTimer();
            }
        }
    });
    muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        muteBtn.textContent = isMuted ? 'Unmute' : 'Mute';
    });
    speedSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        speed = 101 - val;
    });
    algoSelect.addEventListener('change', (e) => {
        updateDescription(e.target.value);
    });
}

function playNote(value) {
    if (isMuted || !audioCtx) return;

    const delay = getDelay();
    const now = Date.now();

    // Throttling: If speed is fast (delay < 50ms), limit sounds to every 50ms
    if (delay < 50 && now - lastPlayedTime < 50) {
        return;
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // Map value (5-95) to frequency (200Hz - 800Hz)
    const frequency = 200 + (value * 6);

    oscillator.type = 'sine'; // Soft sound
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    // Dynamic duration: Shorten sound at high speeds
    // Minimum 0.02s, Maximum 0.1s
    const duration = Math.min(0.1, Math.max(0.02, delay / 1000));

    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Low volume
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);

    lastPlayedTime = now;
}

function updateDescription(algo) {
    const data = algoDescriptions[algo];
    algoTitle.textContent = data.title;
    algoComplexity.textContent = data.complexity;
    algoText.textContent = data.text;
    algoApps.textContent = data.apps;
    algoBest.textContent = data.best;
}

function generateArray() {
    container.innerHTML = '';
    array = [];
    const numBars = 50;
    const type = dataSelect.value;

    if (type === 'random') {
        for (let i = 0; i < numBars; i++) {
            const value = Math.floor(Math.random() * 90) + 5;
            array.push(value);
        }
    } else if (type === 'reversed') {
        for (let i = 0; i < numBars; i++) {
            const value = 95 - (i * (90 / numBars));
            array.push(Math.floor(value));
        }
    } else if (type === 'nearly') {
        for (let i = 0; i < numBars; i++) {
            const value = 5 + (i * (90 / numBars));
            array.push(Math.floor(value));
        }
        for (let k = 0; k < 6; k++) {
            const idx1 = Math.floor(Math.random() * numBars);
            const idx2 = Math.floor(Math.random() * numBars);
            let temp = array[idx1];
            array[idx1] = array[idx2];
            array[idx2] = temp;
        }
    }

    for (let i = 0; i < numBars; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = array[i] + '%';
        container.appendChild(bar);
    }
}

async function sleep(ms) {
    while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getDelay() {
    return speed * 2;
}

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        const seconds = (elapsedTime / 1000).toFixed(2);
        timerElement.textContent = 'Time: ' + seconds + 's';
    }, 10);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetStats() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    timerElement.textContent = 'Time: 0.00s';
    statusText.textContent = '';
    comparisons = 0;
    swaps = 0;
    updateStats();
}

function updateStats() {
    compCountElement.textContent = 'Comparisons: ' + comparisons;
    swapCountElement.textContent = 'Swaps: ' + swaps;
}

async function bubbleSort() {
    isSorting = true;
    startBtn.disabled = true;
    generateBtn.disabled = true;
    algoSelect.disabled = true;
    dataSelect.disabled = true;
    stopBtn.disabled = false;

    startTimer();

    const bars = document.getElementsByClassName('bar');

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].classList.add('compare');
            bars[j + 1].classList.add('compare');

            playNote(array[j]); // Play sound on compare
            await sleep(getDelay());

            comparisons++;
            updateStats();

            if (array[j] > array[j + 1]) {
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;

                bars[j].style.height = array[j] + '%';
                bars[j + 1].style.height = array[j + 1] + '%';

                playNote(array[j]); // Play sound on swap
                swaps++;
                updateStats();
            }

            bars[j].classList.remove('compare');
            bars[j + 1].classList.remove('compare');
        }
        bars[array.length - i - 1].classList.add('sorted');
    }
    for (let k = 0; k < bars.length; k++) {
        bars[k].classList.add('sorted');
    }

    await finishSorting();
}

async function runQuickSort() {
    isSorting = true;
    startBtn.disabled = true;
    generateBtn.disabled = true;
    algoSelect.disabled = true;
    dataSelect.disabled = true;
    stopBtn.disabled = false;

    startTimer();

    await quickSort(0, array.length - 1);

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
    let pivotValue = array[end];
    let pivotIndex = start;

    bars[end].classList.add('pivot');

    for (let i = start; i < end; i++) {
        bars[i].classList.add('compare');
        playNote(array[i]); // Play sound on compare
        await sleep(getDelay());

        comparisons++;
        updateStats();

        if (array[i] < pivotValue) {
            let temp = array[i];
            array[i] = array[pivotIndex];
            array[pivotIndex] = temp;

            bars[i].style.height = array[i] + '%';
            bars[pivotIndex].style.height = array[pivotIndex] + '%';

            playNote(array[i]); // Play sound on swap
            swaps++;
            updateStats();

            pivotIndex++;
        }

        bars[i].classList.remove('compare');
    }

    let temp = array[pivotIndex];
    array[pivotIndex] = array[end];
    array[end] = temp;

    bars[pivotIndex].style.height = array[pivotIndex] + '%';
    bars[end].style.height = array[end] + '%';

    playNote(array[pivotIndex]); // Play sound on pivot swap
    swaps++;
    updateStats();

    bars[end].classList.remove('pivot');

    return pivotIndex;
}

async function runMergeSort() {
    isSorting = true;
    startBtn.disabled = true;
    generateBtn.disabled = true;
    algoSelect.disabled = true;
    dataSelect.disabled = true;
    stopBtn.disabled = false;

    startTimer();

    await mergeSort(0, array.length - 1);

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

    let left = array.slice(start, mid + 1);
    let right = array.slice(mid + 1, end + 1);

    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
        bars[start + i].classList.add('compare');
        bars[mid + 1 + j].classList.add('compare');
        playNote(left[i]); // Play sound on compare
        await sleep(getDelay());

        comparisons++;
        updateStats();

        if (left[i] <= right[j]) {
            array[k] = left[i];
            bars[k].style.height = array[k] + '%';
            bars[k].classList.add('sorted');
            playNote(array[k]); // Play sound on write
            i++;
        } else {
            array[k] = right[j];
            bars[k].style.height = array[k] + '%';
            bars[k].classList.add('sorted');
            playNote(array[k]); // Play sound on write
            j++;
        }

        swaps++;
        updateStats();

        bars[start + i] ? bars[start + i].classList.remove('compare') : null;
        bars[mid + 1 + j] ? bars[mid + 1 + j].classList.remove('compare') : null;

        await sleep(getDelay() / 2);
        bars[k].classList.remove('sorted');
        k++;
    }

    while (i < left.length) {
        array[k] = left[i];
        bars[k].style.height = array[k] + '%';
        bars[k].classList.add('sorted');
        playNote(array[k]);
        swaps++;
        updateStats();
        await sleep(getDelay() / 2);
        bars[k].classList.remove('sorted');
        i++;
        k++;
    }

    while (j < right.length) {
        array[k] = right[j];
        bars[k].style.height = array[k] + '%';
        bars[k].classList.add('sorted');
        playNote(array[k]);
        swaps++;
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

async function insertionSort() {
    isSorting = true;
    startBtn.disabled = true;
    generateBtn.disabled = true;
    algoSelect.disabled = true;
    dataSelect.disabled = true;
    stopBtn.disabled = false;

    startTimer();

    const bars = document.getElementsByClassName('bar');

    // Mark first element as sorted
    bars[0].classList.add('sorted');

    for (let i = 1; i < array.length; i++) {
        let j = i;

        // Highlight element being inserted
        bars[j].classList.add('insertion-compare');
        await sleep(getDelay());

        while (j > 0 && array[j] < array[j - 1]) {
            // Compare
            comparisons++;
            updateStats();
            playNote(array[j]);

            // Swap
            let temp = array[j];
            array[j] = array[j - 1];
            array[j - 1] = temp;

            bars[j].style.height = array[j] + '%';
            bars[j - 1].style.height = array[j - 1] + '%';

            // Move highlight
            bars[j].classList.remove('insertion-compare');
            bars[j].classList.add('sorted'); // It's in the sorted partition now
            bars[j - 1].classList.add('insertion-compare');

            swaps++;
            updateStats();
            playNote(array[j - 1]);

            await sleep(getDelay());
            j--;
        }

        bars[j].classList.remove('insertion-compare');
        bars[j].classList.add('sorted');

        // Ensure all previous are marked sorted
        for (let k = 0; k <= i; k++) {
            bars[k].classList.add('sorted');
        }
    }

    await finishSorting();
}

async function selectionSort() {
    isSorting = true;
    startBtn.disabled = true;
    generateBtn.disabled = true;
    algoSelect.disabled = true;
    dataSelect.disabled = true;
    stopBtn.disabled = false;

    startTimer();

    const bars = document.getElementsByClassName('bar');

    for (let i = 0; i < array.length; i++) {
        let minIdx = i;
        bars[minIdx].classList.add('selection-min'); // Highlight initial min

        for (let j = i + 1; j < array.length; j++) {
            bars[j].classList.add('compare');
            playNote(array[j]);
            await sleep(getDelay());

            comparisons++;
            updateStats();

            if (array[j] < array[minIdx]) {
                bars[minIdx].classList.remove('selection-min');
                minIdx = j;
                bars[minIdx].classList.add('selection-min'); // New min
                playNote(array[minIdx]);
            }

            bars[j].classList.remove('compare');
        }

        if (minIdx !== i) {
            let temp = array[i];
            array[i] = array[minIdx];
            array[minIdx] = temp;

            bars[i].style.height = array[i] + '%';
            bars[minIdx].style.height = array[minIdx] + '%';

            swaps++;
            updateStats();
            playNote(array[i]);
        }

        bars[minIdx].classList.remove('selection-min');
        bars[i].classList.add('sorted');
    }

    await finishSorting();
}

async function finishSorting() {
    stopTimer();
    statusText.textContent = algoSelect.options[algoSelect.selectedIndex].text + ' Completed!';
    stopBtn.disabled = true;
    stopBtn.textContent = 'Stop';
    isPaused = false;

    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < bars.length; i++) {
        bars[i].classList.remove('sorted');
        bars[i].classList.add('finished');
        playNote(array[i]); // Play satisfying finish scale
        await sleep(20);
    }

    isSorting = false;
    generateBtn.disabled = false;
    algoSelect.disabled = false;
    dataSelect.disabled = false;
}

init();
window.addEventListener('resize', () => {
    if (!isSorting) generateArray();
});
