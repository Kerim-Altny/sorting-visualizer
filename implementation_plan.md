# Implementation Plan - Update Visualizer

## Goal
Update the visualizer to show 50 bars, reduce spacing, and ensure auto-load.

## Proposed Changes
### CSS (style.css)
- Change #visualizer-container gap from 4px to 2px.

### JavaScript (script.js)
- Update generateArray to set 
umBars = 50.
- Ensure init() calls generateArray() (already does).

## Verification
- Open index.html.
- Verify 50 bars appear.
- Verify gap is small.
- Verify Shuffle button works.
