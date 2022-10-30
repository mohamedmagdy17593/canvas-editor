import { proxy, useSnapshot } from 'valtio';

export const appState = proxy({
  zoom: 1,
});

export function useAppState() {
  return useSnapshot(appState);
}
