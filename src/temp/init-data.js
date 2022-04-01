const init_options = {
  // elements: [
  //   // list of graph elements to start with
  //   {
  //     // node a
  //     data: { id: "a" },
  //   },
  //   {
  //     // node b
  //     data: { id: "b" },
  //   },
  //   {
  //     // edge ab
  //     data: { id: "ab", source: "a", target: "b" },
  //   },
  // ],
  style: [
    // the stylesheet for the graph
    {
      selector: "node[name]",
      style: {
        "background-color": "#666",
        label: "data(name.value)",
        "min-zoomed-font-size": 12,
        "font-size": 18,
      },
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle",
        "curve-style": "straight",
        "arrow-scale": 1.5,
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
  ],
  layout: {
    name: "grid",
    rows: 1,
  },
  // hideEdgesOnViewport: true,
  pixelRatio: 1.0,
  // motionBlur: true,
  // showFps: true,
};

export { init_options };
