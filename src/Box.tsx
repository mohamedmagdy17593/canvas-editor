import React, { useEffect } from 'react';
import { useAppState, appState } from './App';
import Moveable from 'react-moveable';

function Box({ id }: { id: number }) {
  let { selectedId, zoom } = useAppState();
  let [target, setTarget] = React.useState<any>();
  let [elementGuidelines, setElementGuidelines] = React.useState<any>([]);
  let [frame, setFrame] = React.useState({
    translate: [0, 0],
  });

  let isSelected = id === selectedId;

  useEffect(() => {
    setElementGuidelines(
      Array.from(
        document
          .querySelector('.EditorArea__canvas')
          ?.querySelectorAll('.Box') ?? [],
      ).filter((el) => el !== target),
    );
  }, [target]);

  return (
    <>
      <div
        id={`Box_${id}`}
        className="Box"
        ref={(e) => {
          setTarget(e);
        }}
        onMouseDown={() => {
          appState.selectedId = id;
        }}
      >
        Target
      </div>
      <Moveable
        target={isSelected ? target : undefined}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        keepRatio={false}
        renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
        zoom={zoom}
        edge={false}
        origin={false}
        // resize
        resizable
        throttleResize={1}
        onResizeStart={(e) => {
          e.setOrigin(['%', '%']);
          e.dragStart && e.dragStart.set(frame.translate);
        }}
        onResize={(e) => {
          const beforeTranslate = e.drag.beforeTranslate;
          frame.translate = beforeTranslate;
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${e.height}px`;
          e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
        }}
        // drag
        draggable
        throttleDrag={0}
        onDragStart={(e) => {
          e.set(frame.translate);
        }}
        onDrag={(e) => {
          frame.translate = e.beforeTranslate;
        }}
        onRender={(e) => {
          const { translate } = frame;
          e.target.style.transform = `translate(${translate[0]}px, ${translate[1]}px)`;
        }}
        // snap
        snappable={true}
        elementGuidelines={elementGuidelines}
        verticalGuidelines={[0, 200, 400]}
        horizontalGuidelines={[0, 200, 400]}
        snapThreshold={5}
        isDisplaySnapDigit={true}
        snapGap={true}
        snapDirections={{ top: true, right: true, bottom: true, left: true }}
        elementSnapDirections={{
          top: true,
          right: true,
          bottom: true,
          left: true,
        }}
        snapDigit={0}
      />
    </>
  );
}

export default Box;
