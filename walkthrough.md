# Walkthrough - Sorting Algorithm Visualizer

## Changes
- **Updated index.html**:
    - Added "Stop" button to controls.
- **Updated style.css**:
    - Styled "Stop" button with warning color (Orange).
- **Updated script.js**:
    - Implemented isPaused state.
    - Updated sleep function to wait while paused.
    - Updated startTimer to resume from correct elapsed time.
    - Stop button toggles between "Stop" and "Resume".

## Verification Results
- **Manual Testing**:
    - **Stop**: Pauses animation and timer immediately.
    - **Resume**: Resumes animation and timer from where it left off.
    - **Logic**: Sorting continues correctly after resume.
    - **UI**: Button text updates correctly.
