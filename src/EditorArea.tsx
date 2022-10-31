import React, { useEffect, useMemo, useState } from 'react';
import InfiniteViewer from 'react-infinite-viewer';
import InfiniteViewerClass from 'infinite-viewer';
import Selecto from 'react-selecto';
import Moveable, {
  getElementInfo,
  MoveableManagerInterface,
} from 'react-moveable';
import { appState, useAppState } from './state';
import { useWindowSize } from './utils';

const CANVAS_WIDTH = 1250;
const CANVAS_HEIGHT = 750;

let items = [1, 2, 3, 4, 5, 6];

export const zoomRange = [0.1, 11];

export let infiniteViewer: () => InfiniteViewerClass = () =>
  ({} as InfiniteViewerClass);
export let moveableManager: () => MoveableManagerInterface = () =>
  ({} as MoveableManagerInterface);

type FrameType = { translate: number[] };

function EditorArea() {
  let { zoom, view } = useAppState();
  let [selected, setSelected] = useState([] as (HTMLElement | SVGElement)[]);
  let frame = React.useRef<{
    [key: string]: FrameType;
  }>({});

  let size = useWindowSize();

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
    infiniteViewer = () => ref.current.infiniteViewer as InfiniteViewerClass;

    moveableManager = () =>
      // @ts-ignore
      moveableRef.current.moveable as MoveableManagerInterface;
  }, []);

  useEffect(() => {
    switch (view) {
      case 'actual-size': {
        infiniteViewer().setZoom(1);
        infiniteViewer().scrollTo(0, 0);
        break;
      }
      case 'fit-content': {
        let windowWidth = window.innerWidth;
        let widthScale = windowWidth / CANVAS_WIDTH;

        let windowHeight = window.innerHeight - 86;
        let heightScale = windowHeight / CANVAS_HEIGHT;

        let scale = Math.min(widthScale, heightScale);

        infiniteViewer().setZoom(scale);
        infiniteViewer().scrollCenter();
        break;
      }
      case 'fit-width': {
        let windowWidth = window.innerWidth;
        let widthScale = windowWidth / CANVAS_WIDTH;
        infiniteViewer().setZoom(widthScale);
        infiniteViewer().scrollCenter();
        break;
      }
    }
  }, [view, size]);

  let elementGuidelines = useMemo(() => {
    return Array.from(
      document.querySelector('.EditorArea__canvas')?.querySelectorAll('.Box') ??
        [],
    ).filter((el) => !selected.includes(el as HTMLElement));
  }, [selected]);

  return (
    <>
      <Selecto
        getElementRect={getElementInfo}
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
            selected.some((el) => el === target || el.contains(target)) ||
            target.classList.contains('moveable-area')
          ) {
            e.stop();
          }
        }}
        onSelectEnd={({ isDragStart, selected, inputEvent, rect }) => {
          if (isDragStart) {
            inputEvent.preventDefault();
          }

          let isSelectBox = rect.height > 0 || rect.width > 0;
          if (isSelectBox) {
            return;
          }

          setSelected(selected);
          setTimeout(() => {
            moveableManager().dragStart(inputEvent);
          });
        }}
      ></Selecto>

      <InfiniteViewer
        ref={ref}
        className="EditorArea"
        // useMouseDrag={true}
        useWheelScroll={true}
        useAutoZoom={true}
        zoomRange={zoomRange}
        maxPinchWheel={10}
        onScroll={() => {
          appState.zoom = infiniteViewer().zoom;
        }}
      >
        <div ref={ref} className="EditorArea__canvas">
          {items.map((itemId) => (
            <div key={itemId} id={`Box_${itemId}`} className="Box">
              Target
            </div>
          ))}

          <Moveable
            // ables={[DimensionViewable]}
            // dimensionViewable={true}
            ref={moveableRef}
            targets={selected}
            padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
            // keepRatio={true}
            renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
            zoom={1 / zoom}
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
            snapDirections={{
              top: true,
              right: true,
              bottom: true,
              left: true,
            }}
            elementSnapDirections={{
              top: true,
              right: true,
              bottom: true,
              left: true,
            }}
            snapDigit={0}
            // group
            onDragGroupStart={({ events }) => {
              events.forEach((ev, i) => {
                ev.set(getFrame(ev.target).translate);
              });
            }}
            onDragGroup={({ events }) => {
              events.forEach((ev, i) => {
                getFrame(ev.target).translate = ev.beforeTranslate;
                ev.target.style.transform = `translate(${ev.beforeTranslate[0]}px, ${ev.beforeTranslate[1]}px)`;
              });
            }}
          />
        </div>
      </InfiniteViewer>
    </>
  );
}

export default EditorArea;
