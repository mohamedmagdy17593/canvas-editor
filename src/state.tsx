import { proxy, useSnapshot } from 'valtio';

export const appState = proxy({
  zoom: 1,
  view: 'actual-size',
});

export function useAppState() {
  return useSnapshot(appState);
}
