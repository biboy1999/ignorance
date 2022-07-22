import { nanoid } from "nanoid";
import { Provider as StateProvider, useAtomValue } from "jotai";
import "./App.css";
import { UserInfo } from "./components/panel/UserInfo";
import { Graph } from "./components/graph/Graph";
import { Statusbar } from "./components/Statusbar";
import { isOnlineModeAtom } from "./atom/provider";
import { useStore } from "./store/store";
import DockLayout, { LayoutData, TabData, TabGroup } from "rc-dock";
import { useEffect } from "react";
import { WebrtcProvider } from "y-webrtc";
import { NodeAttributes } from "./components/panel/NodeAttributes";
import {
  SharedTransforms,
  SharedTransformsTabTitle,
} from "./components/panel/transforms/SharedTransforms";
import { TransformJobs } from "./components/panel/transforms/TransformJobs";

function App(): JSX.Element {
  const isOnlineMode = useAtomValue(isOnlineModeAtom);

  const addProvider = useStore((state) => state.addProvider);
  const ydoc = useStore((state) => state.ydoc);
  const awareness = useStore((state) => state.getAwareness());

  const toggleDarkMode = useStore((state) => state.toggleDarkMode);

  useEffect(() => {
    addProvider(
      // @ts-expect-error the fuck
      new WebrtcProvider("test", ydoc, {
        signaling: ["ws://127.0.0.1:4444"],
        awareness: awareness,
        password: "test",
        filterBcConns: false,
      })
    );
  }, []);

  return (
    <>
      <StateProvider>
        <DockLayout
          defaultLayout={layout}
          groups={groups}
          style={{
            position: "absolute",
            left: 10,
            top: 10,
            right: 10,
            bottom: 35,
          }}
        />
        <Statusbar isOnlineMode={isOnlineMode} />
        <button
          className="absolutet top-0 left-0 bg-red-200"
          onClick={toggleDarkMode}
        >
          dark
        </button>
      </StateProvider>
    </>
  );
}

const groups: { [x: string]: TabGroup } = {
  "main-panel": {
    floatable: false,
    maximizable: true,
  },
};

const GraphTab: TabData = {
  id: nanoid(),
  title: "Graph",
  content: <Graph />,
  cached: true,
  closable: false,
  group: "main-panel",
};

const UserInfoTab: TabData = {
  id: nanoid(),
  title: "Userinfo",
  content: <UserInfo />,
  cached: true,
  closable: false,
};

export const SharedTransformTab: TabData = {
  id: nanoid(),
  title: <SharedTransformsTabTitle />,
  content: <SharedTransforms />,
  cached: true,
  closable: false,
};

const TransformJobsTab: TabData = {
  id: nanoid(),
  title: "TransformsJobs",
  content: <TransformJobs />,
  cached: true,
  closable: false,
};

const NodeAttributesTab: TabData = {
  id: nanoid(),
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
