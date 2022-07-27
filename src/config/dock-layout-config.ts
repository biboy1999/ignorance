import { LayoutData } from "rc-dock";
import { GraphTab } from "../components/graph/Graph";
import { NodeAttributesTab } from "../components/panel/NodeAttributes";
import { NodeListTab } from "../components/panel/node-list/NodeList";
import { SharedTransformTab } from "../components/panel/transforms/SharedTransforms";
import { TransformJobsTab } from "../components/panel/transforms/TransformJobs";
import { UserInfoTab } from "../components/panel/UserInfo";
import { GraphNavigatorTab } from "../components/graph/Navigator";

export const layoutConfig: LayoutData = {
  dockbox: {
    mode: "horizontal",
    children: [
      {
        mode: "vertical",
        size: 300,
        children: [
          {
            tabs: [{ ...NodeListTab }],
          },
          {
            tabs: [{ ...GraphNavigatorTab }],
          },
        ],
      },
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
