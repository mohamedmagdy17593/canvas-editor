import React, { useEffect } from 'react';
import Box from './Box';

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
        <Box />
        <Box />
        <Box />
        <Box />
      </div>
    </div>
  );
}

export default EditorArea;
