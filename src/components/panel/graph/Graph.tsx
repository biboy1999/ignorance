import Layers from "cytoscape-layers";
import edgehandles from "cytoscape-edgehandles";
import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import layoutUtilities from "cytoscape-layout-utilities";
import gridGuide from "cytoscape-grid-guide";
import compoundDragAndDrop from "cytoscape-compound-drag-and-drop";
import navigator from "cytoscape-navigator";
import { useEffect } from "react";
import { TabData } from "rc-dock";
import { useOnlineUsers } from "../../../store/online-users";
import { useThrottledCallback } from "../../../utils/hooks/useThrottledCallback";
import { GraphContextMenu } from "./GraphContextMenu";
import { useStore } from "../../../store/store";
import { Toolbar } from "../../Toobar";
import {
  cytoscapeConfig,
  cytoscapeDarkStylesheet,
  cytoscapeLightStylesheet,
} from "../../../config/cytoscape-config";
import { gridGuideConfig } from "../../../config/gridguide-config";
import { useLocalStorage } from "../../../store/misc";
import { registerElementsSync } from "./events/register-yjs";
import {
  registerLayoutPositionUpdate,
  registerNodePositionUpdate,
  registerSetSelectedElements,
} from "./events/register-cy";
import { registerEdgeHandlers } from "./events/register-edgehandles";
import { registerCursorRender } from "./events/register-cursor";

export const Graph = (): JSX.Element => {
  const ynodes = useStore((state) => state.ynodes());
  const yedges = useStore((state) => state.yedges());
  const getAwareness = useStore((state) => state.getAwareness);

  const setCytoscape = useStore((state) => state.setCytoscape);
  const cytoscapeInstance = useStore((state) => state.cytoscape);

  const setSelectedElements = useStore((state) => state.setSelectedElements);

  const darkMode = useLocalStorage((state) => state.darkMode);

  const setUsernames = useOnlineUsers((states) => states.setUsernames);

  // update cursor move
  const handleMouseMove = useThrottledCallback(
    (e: cytoscape.EventObject) => {
      getAwareness().setLocalStateField("position", e.position);
    },
    10,
    []
  );

  // dark mode style
  useEffect(() => {
    if (darkMode) {
      cytoscapeInstance?.style(cytoscapeDarkStylesheet);
    } else {
      cytoscapeInstance?.style(cytoscapeLightStylesheet);
    }
  }, [darkMode, cytoscapeInstance]);

  useEffect(() => {
    // core
    if (typeof cytoscape("core", "layers") !== "function")
      cytoscape.use(Layers);
    if (typeof cytoscape("core", "edgehandles") !== "function")
      cytoscape.use(edgehandles);
    if (typeof cytoscape("core", "layoutUtilities") !== "function")
      cytoscape.use(layoutUtilities);
    if (typeof cytoscape("core", "gridGuide") !== "function")
      cytoscape.use(gridGuide);
    if (typeof cytoscape("core", "compoundDragAndDrop") !== "function")
      cytoscape.use(compoundDragAndDrop);
    if (typeof cytoscape("core", "navigator") !== "function")
      cytoscape.use(navigator);
    // layout
    cytoscape.use(fcose);

    const cy = cytoscape({
      container: document.getElementById("cy"),
      ...cytoscapeConfig,
    });
    setCytoscape(cy);

    // init gridGuide
    // @ts-expect-error gridGuide config
    cy.gridGuide(gridGuideConfig);

    // init compound DragAndDrop
    //// @ts-expect-error compound dnd config
    // cy.compoundDragAndDrop(compoundDndConfig);

    // event register
    const unregisterElementsSync = registerElementsSync(cy, ynodes, yedges);
    const unregisterNodePositionUpdate = registerNodePositionUpdate(cy, ynodes);
    const unregisterLayoutPositionUpdate = registerLayoutPositionUpdate(
      cy,
      ynodes
    );
    const unregisterEdgeHandlers = registerEdgeHandlers(cy, yedges);
    // const unregisterCDnD = registerCDnD(cy, ynodes);
    const unregisterSetSelectedElements = registerSetSelectedElements(
      cy,
      setSelectedElements
    );

    const unregisterCursorRender = registerCursorRender(
      cy,
      getAwareness(),
      handleMouseMove,
      setUsernames
    );

    return (): void => {
      unregisterElementsSync();
      unregisterNodePositionUpdate();
      unregisterLayoutPositionUpdate();
      unregisterEdgeHandlers();
      // unregisterCDnD();
      unregisterSetSelectedElements();
      unregisterCursorRender();
      cy.destroy();
    };
  }, []);

  return (
    <>
      <Toolbar />
      <div id="cy" className="h-full w-full" />
      {cytoscapeInstance && <GraphContextMenu cytoscape={cytoscapeInstance} />}
    </>
  );
};

export const GraphTab: TabData = {
  id: "graph",
  title: "Graph",
  content: <Graph />,
  cached: true,
  closable: false,
};
