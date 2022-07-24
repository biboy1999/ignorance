import { Provider as StateProvider, useAtomValue } from "jotai";
import { useState } from "react";
import { flushSync } from "react-dom";
import DockLayout, {
  DropDirection,
  LayoutBase,
  LayoutData,
  TabData,
} from "rc-dock";
import "./App.css";
import { UserInfo } from "./components/panel/UserInfo";
import { Graph } from "./components/graph/Graph";
import { Statusbar } from "./components/Statusbar";
import { isOnlineModeAtom } from "./atom/provider";
import { NodeAttributes } from "./components/panel/NodeAttributes";
import {
  SharedTransforms,
  SharedTransformsTabTitle,
} from "./components/panel/transforms/SharedTransforms";
import { TransformJobs } from "./components/panel/transforms/TransformJobs";
import { Menubar } from "./components/Menubar";

function App(): JSX.Element {
  const isOnlineMode = useAtomValue(isOnlineModeAtom);

  const [controlledLayout, setControlledLayout] = useState<LayoutBase>(layout);

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
            defaultLayout={layout}
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

const GraphTab: TabData = {
  id: "graph",
  title: "Graph",
  content: <Graph />,
  cached: true,
  closable: false,
};

const UserInfoTab: TabData = {
  id: "userinfo",
  title: "Userinfo",
  content: <UserInfo />,
  cached: true,
  closable: false,
};

export const SharedTransformTab: TabData = {
  id: "sharedtransform",
  title: <SharedTransformsTabTitle />,
  content: <SharedTransforms />,
  cached: true,
  closable: false,
};

const TransformJobsTab: TabData = {
  id: "transformjobs",
  title: "TransformsJobs",
  content: <TransformJobs />,
  cached: true,
  closable: false,
};

const NodeAttributesTab: TabData = {
  id: "nodeattributes",
  title: "NodeAttributes",
  content: <NodeAttributes />,
  cached: true,
  closable: false,
};

const layout: LayoutData = {
  dockbox: {
    mode: "horizontal",
    children: [
      {
        size: 1000,
        tabs: [{ ...GraphTab }],
        panelLock: { panelStyle: "main" },
      },
      {
        mode: "vertical",
        size: 300,
        children: [
          {
            tabs: [{ ...UserInfoTab }],
          },
          {
            tabs: [{ ...SharedTransformTab }, { ...TransformJobsTab }],
          },
          {
            tabs: [{ ...NodeAttributesTab }],
          },
        ],
      },
    ],
  },
};

export default App;
