export let state = {
    array: [],
    isSorting: false,
    isPaused: false,
    isMuted: false,
    speed: 50,
    timerInterval: null,
    startTime: 0,
    elapsedTime: 0,
    comparisons: 0,
    swaps: 0,
    lastPlayedTime: 0,
    audioCtx: null
};

export function updateState(newState) {
    state = { ...state, ...newState };
}
