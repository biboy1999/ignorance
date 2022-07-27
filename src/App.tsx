import { Provider as StateProvider, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import DockLayout, { DropDirection, LayoutBase } from "rc-dock";
import { Statusbar } from "./components/Statusbar";
import { isOnlineModeAtom } from "./atom/provider";
import { Menubar } from "./components/Menubar";
import { layoutConfig } from "./config/dock-layout-config";
import "./App.css";
import { WebrtcProvider } from "y-webrtc";
import { useStore } from "./store/store";

function App(): JSX.Element {
  const isOnlineMode = useAtomValue(isOnlineModeAtom);

  const ydoc = useStore((state) => state.ydoc);
  const getAwareness = useStore((state) => state.getAwareness);
  const addProvider = useStore((state) => state.addProvider);

  const [controlledLayout, setControlledLayout] =
    useState<LayoutBase>(layoutConfig);

  useEffect(() => {
    // @ts-expect-error not typed
    const webrtc = new WebrtcProvider("test", ydoc, {
      awareness: getAwareness(),
      filterBcConns: false,
      signaling: ["ws://127.0.0.1:4444"],
      password: "test",
    });
    addProvider(webrtc);
  }, []);

  const onLayoutChange = (
    newLayout: LayoutBase,
    _currentTabId?: string,
    _direction?: DropDirection
  ): void => {
    console.log(newLayout, _direction);
    // HACK: react 18 batch update break rc-dock
    flushSync(() => {
      setControlledLayout(newLayout);
    });
  };

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
