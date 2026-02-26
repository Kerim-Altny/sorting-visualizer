export const container = document.getElementById('visualizer-container');
export const generateBtn = document.getElementById('generate-btn');
export const startBtn = document.getElementById('start-btn');
export const stopBtn = document.getElementById('stop-btn');
export const muteBtn = document.getElementById('mute-btn');
export const speedSlider = document.getElementById('speed-slider');
export const timerElement = document.getElementById('timer');
export const statusText = document.getElementById('status-text');
export const algoSelect = document.getElementById('algo-select');
export const dataSelect = document.getElementById('data-select');
export const compCountElement = document.getElementById('comp-count');
export const swapCountElement = document.getElementById('swap-count');
export const algoTitle = document.getElementById('algo-title');
export const algoComplexity = document.getElementById('algo-complexity');
export const algoText = document.getElementById('algo-text');
export const algoApps = document.getElementById('algo-apps');
export const algoBest = document.getElementById('algo-best');

export const algoDescriptions = {
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
    },
    heap: {
        title: 'Heap Sort',
        complexity: 'O(n log n)',
        text: 'Heap Sort is a comparison-based sorting algorithm. Heap sort can be thought of as an improved selection sort: like selection sort, heap sort divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element from it and inserting it into the sorted region.',
        apps: 'Systems concerned with security and embedded systems (O(1) auxiliary space).',
        best: 'When O(n log n) is required with O(1) space.'
    }
};
