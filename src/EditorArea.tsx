import React, { useEffect } from 'react';
import InfiniteViewer from 'react-infinite-viewer';
import InfiniteViewerClass from 'infinite-viewer';
import Box from './Box';
import { appState } from './App';

let items = [1, 2, 3, 4, 5];

export const zoomRange = [0.8, 3];

export let infiniteViewer: InfiniteViewerClass = {} as InfiniteViewerClass;

function EditorArea() {
  useEffect(() => {
    let handler: EventListenerOrEventListenerObject = (e) => e.preventDefault();
    document.addEventListener('gesturestart', handler);
    document.addEventListener('gesturechange', handler);
    document.addEventListener('gestureend', handler);
    return () => {
      document.removeEventListener('gesturestart', handler);
      document.removeEventListener('gesturechange', handler);
      document.removeEventListener('gestureend', handler);
    };
  }, []);

  let ref = React.useRef(null);

  useEffect(() => {
    // @ts-ignore
    infiniteViewer = ref.current.infiniteViewer as InfiniteViewerClass;
    infiniteViewer.scrollCenter();
  }, []);

  return (
    <InfiniteViewer
      ref={ref}
      // className="EditorArea"
      // useMouseDrag={true}
      useWheelScroll={true}
      useAutoZoom={true}
      zoomRange={zoomRange}
      maxPinchWheel={10}
      onScroll={() => {
        appState.zoom = infiniteViewer.zoom;
      }}
    >
      <div ref={ref} className="EditorArea__canvas">
        {items.map((itemId) => (
          <Box key={itemId} id={itemId} />
        ))}
      </div>
    </InfiniteViewer>
  );
}

export default EditorArea;
