import { Provider as StateProvider, useAtomValue } from "jotai";
import { useState } from "react";
import { flushSync } from "react-dom";
import DockLayout, { DropDirection, LayoutBase } from "rc-dock";
import { Statusbar } from "./components/Statusbar";
import { isOnlineModeAtom } from "./atom/provider";
import { Menubar } from "./components/Menubar";
import { layoutConfig } from "./config/dock-layout-config";
import "./App.css";

function App(): JSX.Element {
  const isOnlineMode = useAtomValue(isOnlineModeAtom);

  const [controlledLayout, setControlledLayout] =
    useState<LayoutBase>(layoutConfig);

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
