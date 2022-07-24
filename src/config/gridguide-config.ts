export const gridGuideConfig = {
  // On/Off Modules
  /* From the following four snap options, at most one should be true at a given time */
  snapToGridOnRelease: false, // Snap to grid on release
  snapToGridDuringDrag: false, // Snap to grid during drag
  snapToAlignmentLocationOnRelease: false, // Snap to alignment location on release
  snapToAlignmentLocationDuringDrag: false, // Snap to alignment location during drag
  distributionGuidelines: false, // Distribution guidelines
  geometricGuideline: false, // Geometric guidelines
  initPosAlignment: false, // Guideline to initial mouse position
  centerToEdgeAlignment: false, // Center to edge alignment
  resize: false, // Adjust node sizes to cell sizes
  parentPadding: false, // Adjust parent sizes to cell sizes by padding
  drawGrid: true, // Draw grid background

  // General
  gridSpacing: 50, // Distance between the lines of the grid.
  snapToGridCenter: true, // Snaps nodes to center of gridlines. When false, snaps to gridlines themselves. Note that either snapToGridOnRelease or snapToGridDuringDrag must be true.

  // Draw Grid
  zoomDash: false, // Determines whether the size of the dashes should change when the drawing is zoomed in and out if grid is drawn.
  panGrid: true, // Determines whether the grid should move then the user moves the graph if grid is drawn.
  gridStackOrder: 0, // Namely z-index
  gridColor: "rgba(157, 157, 157, .4)", // Color of grid lines
  lineWidth: 1.0, // Width of grid lines

  // Guidelines
  guidelinesStackOrder: 4, // z-index of guidelines
  guidelinesTolerance: 2.0, // Tolerance distance for rendered positions of nodes' interaction.
  guidelinesStyle: {
    // Set ctx properties of line. Properties are here:
    strokeStyle: "#8b7d6b", // color of geometric guidelines
    geometricGuidelineRange: 400, // range of geometric guidelines
    range: 100, // max range of distribution guidelines
    minDistRange: 10, // min range for distribution guidelines
    distGuidelineOffset: 10, // shift amount of distribution guidelines
    horizontalDistColor: "#ff0000", // color of horizontal distribution alignment
    verticalDistColor: "#00ff00", // color of vertical distribution alignment
    initPosAlignmentColor: "#0000ff", // color of alignment to initial mouse location
    lineDash: [0, 0], // line style of geometric guidelines
    horizontalDistLine: [0, 0], // line style of horizontal distribution guidelines
    verticalDistLine: [0, 0], // line style of vertical distribution guidelines
    initPosAlignmentLine: [0, 0], // line style of alignment to initial mouse position
  },

  // Parent Padding
  parentSpacing: -1, // -1 to set paddings of parents to gridSpacing
};
