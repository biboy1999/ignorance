export const cytoscapeNavigatorConfig = {
  container: "#cygraphnavigator", // string | false | undefined. Supported strings: an element id selector (like "#someId"), or a className selector (like ".someClassName"). Otherwise an element will be created by the library.
  viewLiveFramerate: 0, // set false to update graph pan only on drag end; set 0 to do it instantly; set a number (frames per second) to update not more than N times per second
  thumbnailEventFramerate: 30, // max thumbnail's updates per second triggered by graph updates
  thumbnailLiveFramerate: false, // max thumbnail's updates per second. Set false to disable
  dblClickDelay: 200, // milliseconds
  removeCustomContainer: false, // destroy the container specified by user on plugin destroy
  rerenderDelay: 50, // ms to throttle rerender updates to the panzoom for performance
};
