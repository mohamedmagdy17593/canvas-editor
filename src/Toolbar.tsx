import React from 'react';
import { useAppState, appState } from './state';
import { infiniteViewer } from './EditorArea';
import { zoomToPercent, percentToZoom } from './utils';

function Toolbar() {
  let { zoom, view } = useAppState();
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
              infiniteViewer().setZoom(percentToZoom(value));
            }}
            type="range"
            min={0}
            max={100}
          />
        </label>
      </div>

      <div>
        <label className="label-control">
          View:
          <select
            className="Select"
            value={view}
            onChange={(e) => {
              appState.view = e.target.value;
            }}
          >
            <option value="actual-size">Actual Size</option>
            <option value="fit-content">Fit Content</option>
            <option value="fit-width">Fit Width</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default Toolbar;
