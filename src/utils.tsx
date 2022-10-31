import { useEffect, useState } from 'react';
import { zoomRange } from './EditorArea';

export function convertRange(
  value: number,
  r1: [number, number],
  r2: [number, number],
) {
  return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
}

export function zoomToPercent(value: number) {
  return value < 1
    ? convertRange(value, [zoomRange[0], 1], [0, 50])
    : convertRange(value, [1, zoomRange[1]], [50, 100]);
}

export function percentToZoom(value: number) {
  return value < 50
    ? convertRange(value, [0, 50], [zoomRange[0], 1])
    : convertRange(value, [50, 100], [1, zoomRange[1]]);
}

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined as undefined | number,
    height: undefined as undefined | number,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}
