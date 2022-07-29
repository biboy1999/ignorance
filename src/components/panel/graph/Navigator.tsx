import { TabData } from "rc-dock";
import { useDeferredValue, useEffect, useRef } from "react";
import useResizeObserver from "use-resize-observer";
import { useStore } from "../../../store/store";
import navigator from "cytoscape-navigator";
import { cytoscapeNavigatorConfig } from "../../../config/cytoscape-navigator-config";
import "cytoscape-navigator/cytoscape.js-navigator.css";

const GraphNavigator = (): JSX.Element => {
  const cytoscape = useStore((state) => state.cytoscape);
  const navigatorRef = useRef<navigator.Nav>();
  const { ref, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>();
  const deferredWidth = useDeferredValue(width);
  const deferredHeight = useDeferredValue(height);

  useEffect(() => {
    const nav = cytoscape?.navigator(cytoscapeNavigatorConfig);
    navigatorRef.current = nav;
    return () => nav?.destroy();
  }, [cytoscape]);

  useEffect(() => {
    // HACK: forcing update thumbnail when resizing panel
    //@ts-expect-error force update panel size
    navigatorRef.current?._setupPanel();
    //@ts-expect-error force update thumbnail
    navigatorRef.current?._onRenderHandler();
  }, [deferredWidth, deferredHeight]);

  return (
    <div
      ref={ref}
      id="cygraphnavigator"
      className="w-full h-full overflow-auto"
    ></div>
  );
};

export const GraphNavigatorTab: TabData = {
  id: "graphnavigator",
  title: "Graph Navigator",
  content: <GraphNavigator />,
  cached: true,
  closable: true,
};
