# Walkthrough - Sorting Algorithm Visualizer

## Changes
- **Updated index.html**:
    - Renamed "Shuffle" button to "Generate".
    - Added "Data Type" dropdown (Random, Reversed, Nearly Sorted).
    - Added complexity display next to algorithm title.
- **Updated style.css**:
    - Styled the new dropdown and complexity text.
- **Updated script.js**:
    - Implemented generateArray logic for different data types.
    - Added complexity field to lgoDescriptions.
    - Updated updateDescription to show complexity.
    - Updated event listeners for the renamed button.

## Verification Results
- **Manual Testing**:
    - **Generate Button**: Generates new array based on selected type.
    - **Random**: Generates random bars.
    - **Reversed**: Generates bars sorted from high to low.
    - **Nearly Sorted**: Generates sorted bars with a few swaps.
    - **Complexity**: Displays correct O-notation for each algorithm (e.g., O(n²) for Bubble, O(n log n) for Quick/Merge).
