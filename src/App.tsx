import EditorArea from './EditorArea';
import Toolbar from './Toolbar';
import { proxy, useSnapshot } from 'valtio';

export const appState = proxy({ scale: 1 });

export function useAppState() {
  return useSnapshot(appState);
}

function App() {
  return (
    <div className="App">
      <Toolbar />
      <EditorArea />
    </div>
  );
}

export default App;
