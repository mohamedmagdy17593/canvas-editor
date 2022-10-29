import React, { useEffect } from 'react';

import { createUseGesture, dragAction, pinchAction } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';
import Box from './Box';
import { appState } from './App';

const useGesture = createUseGesture([dragAction, pinchAction]);

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

  let [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotateZ: 0,
  }));

  let editorRef = React.useRef<HTMLDivElement>(null);
  let ref = React.useRef<HTMLDivElement>(null);

  useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y], event, ...rest }) => {
        if (pinching) return cancel();

        if (
          [editorRef.current, ref.current].includes(
            event.target as HTMLDivElement,
          )
        ) {
          api.start({ x, y });
        }
      },
      onPinch: ({
        origin: [ox, oy],
        first,
        movement: [ms],
        offset: [s, a],
        memo,
      }) => {
        if (first) {
          const { width, height, x, y } = ref.current!.getBoundingClientRect();
          const tx = ox - (x + width / 2);
          const ty = oy - (y + height / 2);
          memo = [style.x.get(), style.y.get(), tx, ty];
        }

        const x = memo[0] - (ms - 1) * memo[2];
        const y = memo[1] - (ms - 1) * memo[3];
        api.start({ scale: s, rotateZ: a, x, y });
        appState.scale = s;
        return memo;
      },
    },
    {
      target: editorRef,
      drag: { from: () => [style.x.get(), style.y.get()] },
      pinch: { scaleBounds: { min: 0.5, max: 2 }, rubberband: false },
    },
  );

  return (
    <animated.div ref={editorRef} className="EditorArea">
      <animated.div ref={ref} style={style} className="EditorArea__canvas">
        <Box />
        <Box />
        <Box />
        <Box />
      </animated.div>
    </animated.div>
  );
}

export default EditorArea;
