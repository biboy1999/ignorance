export const cytoscapeLightStylesheet: cytoscape.Stylesheet[] = [
  // the stylesheet for the graph
  {
    selector: "core",
    // @ts-expect-error Core.css type
    style: {
      "active-bg-color": "white",
    },
  },
  {
    selector: "node[label]",
    style: {
      color: "black",
      label: "data(label)",
      "background-color": "#666",
      "min-zoomed-font-size": 12,
      "font-size": 18,
    },
  },
  {
    selector: "node[color]",
    style: {
      "background-color": "data(color)",
    },
  },
  {
    selector: "edge",
    style: {
      width: 2,
      "line-color": "#999",
      "target-arrow-color": "#999",
      "target-arrow-shape": "triangle",
      "curve-style": "straight",
      "arrow-scale": 1.5,
    },
  },
  {
    selector: "edge[label]",
    style: {
      label: "data(label)",
      color: "black",
      "text-margin-y": -15,
      "text-rotation": "autorotate",
    },
  },
  {
    selector: "edge[color]",
    style: {
      "line-color": "data(color)",
    },
  },
  {
    selector: ":selected",
    style: {
      "line-color": "red",
      "background-color": "red",
      "target-arrow-color": "red",
    },
  },
  {
    selector: "node[label]:parent",
    style: {
      color: "black",
      "background-color": "#bbb",
      label: "data(label)",
      "min-zoomed-font-size": 12,
      "font-size": 18,
    },
  },
  {
    selector: ".eh-handle",
    style: {
      "background-color": "red",
      width: 12,
      height: 12,
      shape: "ellipse",
      "overlay-opacity": 0,
      "border-width": 12, // makes the handle easier to hit
      "border-opacity": 0,
    },
  },

  {
    selector: ".eh-hover",
    style: {
      "background-color": "red",
    },
  },

  {
    selector: ".eh-source",
    style: {
      "border-width": 2,
      "border-color": "red",
    },
  },

  {
    selector: ".eh-target",
    style: {
      "border-width": 2,
      "border-color": "red",
    },
  },

  {
    selector: ".eh-preview, .eh-ghost-edge",
    style: {
      "background-color": "red",
      "line-color": "red",
      "target-arrow-color": "red",
      "source-arrow-color": "red",
    },
  },

  {
    selector: ".eh-ghost-edge.eh-preview-active",
    style: {
      opacity: 0,
    },
  },
];

export const cytoscapeDarkStylesheet: cytoscape.Stylesheet[] = [
  // the stylesheet for the graph
  {
    selector: "core",
    // @ts-expect-error Core.css type
    style: {
      "active-bg-color": "white",
    },
  },
  {
    selector: "node[label]",
    style: {
      color: "white",
      label: "data(label)",
      "background-color": "#555",
      "min-zoomed-font-size": 12,
      "font-size": 18,
    },
  },
  {
    selector: "node[color]",
    style: {
      "background-color": "data(color)",
    },
  },
  {
    selector: "node[label]:active",
    style: {
      "overlay-color": "white",
    },
  },
  {
    selector: "edge",
    style: {
      width: 2,
      "line-color": "#bbb",
      "target-arrow-color": "#bbb",
      "target-arrow-shape": "triangle",
      "curve-style": "straight",
      "arrow-scale": 1.5,
    },
  },
  {
    selector: "edge[label]",
    style: {
      label: "data(label)",
      color: "white",
      "text-margin-y": -15,
      "text-rotation": "autorotate",
    },
  },
  {
    selector: "edge[color]",
    style: {
      "line-color": "data(color)",
    },
  },
  {
    selector: ":selected",
    style: {
      "line-color": "#F30A49",
      "background-color": "#F30A49",
      "target-arrow-color": "#F30A49",
    },
  },
  {
    selector: "[label]:parent",
    style: {
      color: "white",
      "background-color": "#252525",
      label: "data(label)",
      "min-zoomed-font-size": 12,
      "font-size": 18,
    },
  },
  {
    selector: ".eh-handle",
    style: {
      "background-color": "#F30A49",
      width: 12,
      height: 12,
      shape: "ellipse",
      "overlay-opacity": 0,
      "border-width": 12, // makes the handle easier to hit
      "border-opacity": 0,
    },
  },

  {
    selector: ".eh-hover",
    style: {
      "background-color": "#F30A49",
    },
  },

  {
    selector: ".eh-source",
    style: {
      "border-width": 2,
      "border-color": "#F30A49",
    },
  },

  {
    selector: ".eh-target",
    style: {
      "border-width": 2,
      "border-color": "#F30A49",
    },
  },

  {
    selector: ".eh-preview, .eh-ghost-edge",
    style: {
      "background-color": "#F30A49",
      "line-color": "#F30A49",
      "target-arrow-color": "#F30A49",
      "source-arrow-color": "#F30A49",
    },
  },

  {
    selector: ".eh-ghost-edge.eh-preview-active",
    style: {
      opacity: 0,
    },
  },
];

export const cytoscapeConfig: cytoscape.CytoscapeOptions = {
  layout: {
    name: "grid",
    rows: 1,
  },
  wheelSensitivity: 0.3,
  // hideEdgesOnViewport: true,
  pixelRatio: 1.0,
  // motionBlur: true,
  // showFps: true,
};
