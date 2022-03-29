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
      },
    },
    {
      selector: "edge",
      style: {
        width: 3,
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle",
        "curve-style": "straight",
        "arrow-scale": 1.5,
      },
    },
  ],
  layout: {
    name: "grid",
    rows: 1,
  },
};

export { init_options };
