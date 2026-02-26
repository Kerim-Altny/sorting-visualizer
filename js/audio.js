import { state } from './state.js';
import { getDelay } from './utils.js';

export function playNote(value) {
    if (state.isMuted || !state.audioCtx) return;

    const delay = getDelay();
    const now = Date.now();

    if (delay < 50 && now - state.lastPlayedTime < 50) {
        return;
    }

    const oscillator = state.audioCtx.createOscillator();
    const gainNode = state.audioCtx.createGain();

    const frequency = 200 + (value * 6);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, state.audioCtx.currentTime);

    const duration = Math.min(0.1, Math.max(0.02, delay / 1000));

    gainNode.gain.setValueAtTime(0.05, state.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(state.audioCtx.destination);

    oscillator.start();
    oscillator.stop(state.audioCtx.currentTime + duration);

    state.lastPlayedTime = now;
}
