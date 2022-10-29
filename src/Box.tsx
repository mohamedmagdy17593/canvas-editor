import React from 'react';
import { Rnd } from 'react-rnd';
import { useAppState } from './App';

function Box() {
  let appState = useAppState();
  return (
    <Rnd
      className="Box Drag-Box"
      default={{
        x: 0,
        y: 0,
        width: 200,
        height: 200,
      }}
      dragGrid={[10, 10]}
      resizeGrid={[10, 10]}
      scale={appState.scale}
    ></Rnd>
  );
}

export default Box;
