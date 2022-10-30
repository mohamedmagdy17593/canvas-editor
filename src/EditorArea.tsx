import React, { useEffect } from 'react';
import Box from './Box';

let items = [1, 2, 3, 4, 5];

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

  let editorRef = React.useRef<HTMLDivElement>(null);
  let ref = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={editorRef} className="EditorArea">
      <div ref={ref} className="EditorArea__canvas">
        {items.map((itemId) => (
          <Box key={itemId} id={itemId} />
        ))}
      </div>
    </div>
  );
}

export default EditorArea;
