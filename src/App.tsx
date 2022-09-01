import { Provider as StateProvider, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import DockLayout, { DropDirection, LayoutBase } from "rc-dock";
import { Statusbar } from "./components/Statusbar";
import { isOnlineModeAtom } from "./atom/provider";
import { Menubar } from "./components/Menubar";
import { layoutConfig } from "./config/dock-layout-config";
import "./App.css";
import { useStore } from "./store/store";
import { initYjsEvent } from "./events/yjs";
import { initEvent } from "./events/events";
import { initCytoscapeEvent } from "./events/cytoscape";
import { initEdgeHandles } from "./events/edgehandles";
import { initCursor } from "./events/cursor";
import { initAwareness } from "./events/awareness";

function App(): JSX.Element {
  const isOnlineMode = useAtomValue(isOnlineModeAtom);

  const [controlledLayout, setControlledLayout] =
    useState<LayoutBase>(layoutConfig);

  const yelements = useStore((state) => state.yelements());
  const cy = useStore((state) => state.cytoscape);
  const getAwareness = useStore((state) => state.getAwareness);

  const onLayoutChange = (
    newLayout: LayoutBase,
    _currentTabId?: string,
    _direction?: DropDirection
  ): void => {
    // HACK: react 18 batch update break rc-dock
    flushSync(() => {
      setControlledLayout(newLayout);
    });
  };

  useEffect(() => {
    if (!cy) return;
    initEvent(yelements, cy);
    const unYjsEvnet = initYjsEvent(yelements, cy);
    const unCytoscapeEvent = initCytoscapeEvent(yelements, cy);
    const unEdgeHandles = initEdgeHandles(cy);
    const unCursor = initCursor(cy, getAwareness());
    const unAwareness = initAwareness(getAwareness());
    return () => {
      unYjsEvnet();
      unCytoscapeEvent();
      unEdgeHandles();
      unCursor();
      unAwareness();
    };
  }, [cy]);

  return (
    <>
      <StateProvider>
        <div className="h-full flex flex-col">
          <Menubar />
          <DockLayout
            onLayoutChange={onLayoutChange}
            defaultLayout={layoutConfig}
            layout={controlledLayout}
            style={{
              display: "flex",
              flex: "1 1 0%",
              margin: "0.350rem 0.450rem 0.450rem 0.525rem",
            }}
          />
          <Statusbar isOnlineMode={isOnlineMode} />
        </div>
      </StateProvider>
    </>
  );
}

export default App;
