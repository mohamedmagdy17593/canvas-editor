import React, { useEffect, useMemo, useState } from 'react';
import InfiniteViewer from 'react-infinite-viewer';
import InfiniteViewerClass from 'infinite-viewer';
import Selecto from 'react-selecto';
import Moveable, { MoveableManagerInterface } from 'react-moveable';
import { appState, useAppState } from './state';

let items = [1, 2, 3, 4, 5, 6];

export const zoomRange = [0.5, 6];

export let infiniteViewer: InfiniteViewerClass = {} as InfiniteViewerClass;
export let moveableManager: MoveableManagerInterface =
  {} as MoveableManagerInterface;

type FrameType = { translate: number[] };

function EditorArea() {
  let { zoom } = useAppState();
  let [selected, setSelected] = useState([] as (HTMLElement | SVGElement)[]);
  let frame = React.useRef<{
    [key: string]: FrameType;
  }>({});

  function getFrame(el: HTMLElement | SVGElement) {
    let id = el.id;
    frame.current[id] = frame.current[id] ?? { translate: [0, 0] };
    return frame.current[id];
  }

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
  let moveableRef = React.useRef(null);

  useEffect(() => {
    // @ts-ignore
    infiniteViewer = ref.current.infiniteViewer as InfiniteViewerClass;
    infiniteViewer.scrollCenter();

    // @ts-ignore
    moveableManager = moveableRef.current.moveable as MoveableManagerInterface;
  }, []);

  let elementGuidelines = useMemo(() => {
    return Array.from(
      document.querySelector('.EditorArea__canvas')?.querySelectorAll('.Box') ??
        [],
    ).filter((el) => !selected.includes(el as HTMLElement));
  }, [selected]);

  return (
    <>
      <InfiniteViewer
        ref={ref}
        className="EditorArea"
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
            <div key={itemId} id={`Box_${itemId}`} className="Box">
              Target
            </div>
          ))}
        </div>
      </InfiniteViewer>

      <Selecto
        dragContainer={'.EditorArea'}
        selectableTargets={['.Box']}
        hitRate={0}
        selectByClick={true}
        selectFromInside={false}
        ratio={0}
        toggleContinueSelect={['shift']}
        preventDefault={true}
        onSelect={(e) => {
          let newSelected = [...selected];
          newSelected.push(...e.added);
          newSelected = newSelected.filter((el) => !e.removed.includes(el));
          setSelected(newSelected);
        }}
        onDragStart={(e) => {
          let event = e.inputEvent;
          let target = event.target;

          if (
            (event.type === 'touchstart' && e.isTrusted) ||
            selected.some((el) => el === target || el.contains(target))
            // target.classList.contains('Box')
          ) {
            e.stop();
          }
        }}
        onSelectEnd={({ isDragStart, selected, inputEvent, rect }) => {
          if (isDragStart) {
            inputEvent.preventDefault();
          }

          setSelected(selected);
          // @ts-ignore
          setTimeout(() => {
            moveableManager.dragStart(inputEvent);
          });
        }}
      ></Selecto>

      <Moveable
        ref={moveableRef}
        targets={selected}
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
          e.dragStart && e.dragStart.set(getFrame(e.target).translate);
        }}
        onResize={(e) => {
          const beforeTranslate = e.drag.beforeTranslate;
          getFrame(e.target).translate = beforeTranslate;
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${e.height}px`;
          e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
        }}
        // drag
        draggable
        throttleDrag={0}
        onDragStart={(e) => {
          e.set(getFrame(e.target).translate);
        }}
        onDrag={(e) => {
          getFrame(e.target).translate = e.beforeTranslate;
        }}
        onRender={(e) => {
          const { translate } = getFrame(e.target);
          e.target.style.transform = `translate(${translate[0]}px, ${translate[1]}px)`;
        }}
        // snap
        snappable={true}
        elementGuidelines={elementGuidelines}
        // verticalGuidelines={[0, 200, 400]}
        // horizontalGuidelines={[0, 200, 400]}
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

export default EditorArea;
