import Layers from "cytoscape-layers";
import edgehandles from "cytoscape-edgehandles";
import cytoscape, { Collection } from "cytoscape";
import fcose from "cytoscape-fcose";
import layoutUtilities from "cytoscape-layout-utilities";
import gridGuide from "cytoscape-grid-guide";
import compoundDragAndDrop from "cytoscape-compound-drag-and-drop";
import navigator from "cytoscape-navigator";
import { useEffect } from "react";
import { TabData } from "rc-dock";
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

export const Graph = (): JSX.Element => {
  const setCytoscape = useStore((state) => state.setCytoscape);
  const cytoscapeInstance = useStore((state) => state.cytoscape);

  const darkMode = useLocalStorage((state) => state.darkMode);

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

    //custom data with change
    if (typeof cytoscape("collection", "setData") !== "function")
      cytoscape(
        "collection",
        "setData",
        function (this: Collection, key: string, value: string) {
          this.data(key, value).emit("setdata", [key, value]);
        }
      );

    if (typeof cytoscape("collection", "changeDataKey") !== "function")
      cytoscape(
        "collection",
        "changeDataKey",
        function (this: Collection, oldKey: string, newKey: string) {
          const value = this.data(oldKey);
          this.removeData(oldKey);
          this.data(newKey, value).emit("changedatakey", [oldKey, newKey]);
        }
      );

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

    return (): void => {
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
