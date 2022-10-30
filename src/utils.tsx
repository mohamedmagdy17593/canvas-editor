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
