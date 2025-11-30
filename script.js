const container = document.getElementById('visualizer-container');
const shuffleBtn = document.getElementById('shuffle-btn');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const speedSlider = document.getElementById('speed-slider');
const timerElement = document.getElementById('timer');
const statusText = document.getElementById('status-text');
const algoSelect = document.getElementById('algo-select');
const compCountElement = document.getElementById('comp-count');
const swapCountElement = document.getElementById('swap-count');
const algoTitle = document.getElementById('algo-title');
const algoText = document.getElementById('algo-text');

let array = [];
let isSorting = false;
let isPaused = false;
let speed = 50;
let timerInterval;
let startTime;
let elapsedTime = 0;
let comparisons = 0;
let swaps = 0;

const algoDescriptions = {
    bubble: {
        title: 'Bubble Sort',
        text: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. It is known for its simplicity but is inefficient for large lists.'
    },
    quick: {
        title: 'Quick Sort',
        text: 'Quick Sort is a highly efficient divide-and-conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot. It is one of the fastest sorting algorithms in practice.'
    }
};

function init() {
    generateArray();
    shuffleBtn.addEventListener('click', () => {
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
            resetStats();
            const algo = algoSelect.value;
            if (algo === 'bubble') {
                bubbleSort();
            } else if (algo === 'quick') {
                runQuickSort();
            }
        }
    });
    stopBtn.addEventListener('click', () => {
        if (isSorting) {
            if (isPaused) {
                // Resume
                isPaused = false;
                stopBtn.textContent = 'Stop';
                startTimer();
            } else {
                // Pause
                isPaused = true;
                stopBtn.textContent = 'Resume';
                stopTimer();
            }
        }
    });
    speedSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        speed = 101 - val; 
    });
    algoSelect.addEventListener('change', (e) => {
        const algo = e.target.value;
        algoTitle.textContent = algoDescriptions[algo].title;
        algoText.textContent = algoDescriptions[algo].text;
    });
}

function generateArray() {
    container.innerHTML = '';
    array = [];
    const numBars = 50; 
    
    for (let i = 0; i < numBars; i++) {
        const value = Math.floor(Math.random() * 90) + 5; 
        array.push(value);
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = value + '%';
        container.appendChild(bar);
    }
}

async function sleep(ms) {
    // If paused, wait until unpaused
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
    shuffleBtn.disabled = true;
    algoSelect.disabled = true;
    stopBtn.disabled = false;
    
    startTimer();
    
    const bars = document.getElementsByClassName('bar');
    
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].classList.add('compare');
            bars[j + 1].classList.add('compare');
            
            await sleep(getDelay());
            
            comparisons++;
            updateStats();
            
            if (array[j] > array[j + 1]) {
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
                
                bars[j].style.height = array[j] + '%';
                bars[j + 1].style.height = array[j + 1] + '%';
                
                swaps++;
                updateStats();
            }
            
            bars[j].classList.remove('compare');
            bars[j + 1].classList.remove('compare');
        }
        bars[array.length - i - 1].classList.add('sorted');
    }
    for(let k=0; k < bars.length; k++) {
        bars[k].classList.add('sorted');
    }
    
    await finishSorting();
}

async function runQuickSort() {
    isSorting = true;
    startBtn.disabled = true;
    shuffleBtn.disabled = true;
    algoSelect.disabled = true;
    stopBtn.disabled = false;
    
    startTimer();
    
    await quickSort(0, array.length - 1);
    
    const bars = document.getElementsByClassName('bar');
    for(let k=0; k < bars.length; k++) {
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
        await sleep(getDelay());
        
        comparisons++;
        updateStats();
        
        if (array[i] < pivotValue) {
            let temp = array[i];
            array[i] = array[pivotIndex];
            array[pivotIndex] = temp;
            
            bars[i].style.height = array[i] + '%';
            bars[pivotIndex].style.height = array[pivotIndex] + '%';
            
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
    
    swaps++; 
    updateStats();
    
    bars[end].classList.remove('pivot');
    
    return pivotIndex;
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
        await sleep(20); 
    }
    
    isSorting = false;
    shuffleBtn.disabled = false;
    algoSelect.disabled = false;
}

init();
window.addEventListener('resize', () => {
    if (!isSorting) generateArray();
});
