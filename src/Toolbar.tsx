import React from 'react';
import { useAppState } from './App';
import { infiniteViewer } from './EditorArea';
import { zoomToPercent, percentToZoom } from './utils';

function Toolbar() {
  let { zoom } = useAppState();
  let percentZoom = zoomToPercent(zoom);
  return (
    <div className="Toolbar">
      <div>
        <label className="label-control">
          Zoom:
          <input
            className="ZoomLevel"
            value={percentZoom}
            onChange={(e) => {
              let value = +e.target.value;
              infiniteViewer.setZoom(percentToZoom(value));
            }}
            type="range"
            min={0}
            max={100}
          />
        </label>
      </div>
    </div>
  );
}

export default Toolbar;
