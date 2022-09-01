import { Elements } from "../types/types";
import { CollectionReturnValue } from "cytoscape";
import debounce from "lodash.debounce";
import { YData, YElement, YNodePosition } from "../types/yjs";
import { Map as YMap } from "yjs";
import { addYjsElements } from "../utils/yjs";
import { useStore } from "../store/store";

export const initCytoscapeEvent = (
  yelements: YMap<YElement>,
  cy: cytoscape.Core
): (() => void) => {
  // cytoscape emit 1 elements each event
  // debounce and process at once
  const emitEvent = (action: string, elements: Elements[]): void => {
    if (action === "add") {
      yelements.doc?.transact(() => {
        addYjsElements(elements, yelements);
      });
    } else {
      yelements.doc?.transact(() => {
        elements.forEach((ele) => ele.data.id && yelements.delete(ele.data.id));
      });
    }

    elements.length = 0;
  };

  const debounceAddEvnet = debounce(emitEvent, 250);
  const debounceRemoveEvnet = debounce(emitEvent, 250);

  const removed: Elements[] = [];
  const added: Elements[] = [];
  const handleElementsAddRemove: cytoscape.EventHandler = (e) => {
    const targets = e.target as CollectionReturnValue;

    targets.forEach((ele) => {
      // for edgehandles ghost node and edge
      if (ele.hasClass("eh-ghost") || ele.hasClass("eh-preview")) return;

      const element = {
        data: ele.data(),
        group: ele.group(),
        ...(ele.group() === "nodes" && { position: ele.position() }),
      } as Elements;

      // @ts-expect-error cytoscape  wrong typed?
      if (e.type === "add") added.push(element);
      // @ts-expect-error cytoscape wrong typed?
      else if (e.type === "remove") removed.push(element);
    });

    if (added.length) debounceAddEvnet("add", added);
    if (removed.length) debounceRemoveEvnet("remove", removed);
  };

  // @ts-expect-error cytoscape custom event
  const handleDataChange: cytoscape.EventHandler = (e, key, value) => {
    const targets = e.target as CollectionReturnValue;

    targets.forEach((ele) => {
      // for edgehandles ghost node and edge
      if (ele.hasClass("eh-ghost") || ele.hasClass("eh-preview")) return;

      yelements.doc?.transact(() => {
        const ydata = yelements.get(ele.id())?.get("data") as YData;
        ydata.set(key, value);
      });
    });
  };

  // @ts-expect-error cytoscape custom event
  const handleDataKeyChange: cytoscape.EventHandler = (e, oldKey, newKey) => {
    const targets = e.target as CollectionReturnValue;

    targets.forEach((ele) => {
      yelements.doc?.transact(() => {
        const ydata = yelements.get(ele.id())?.get("data") as YData;
        const value = ydata.get(oldKey) ?? "";
        ydata.set(newKey, value);
        ydata.delete(oldKey);
      });
    });
  };

  // TODO: alternative position update, maybe with awareness
  const handlePositionChange: cytoscape.EventHandler = (e) => {
    const targets = e.target as CollectionReturnValue;

    yelements.doc?.transact(() => {
      targets.forEach((ele) => {
        // for edgehandles ghost node and edge
        if (ele.hasClass("eh-ghost") || ele.hasClass("eh-preview")) return;

        const yposition = yelements
          .get(ele.id())
          ?.get("position") as YNodePosition;
        // set only value change
        if (yposition.get("x") !== ele.position("x"))
          yposition.set("x", ele.position("x"));
        if (yposition.get("y") !== ele.position("y"))
          yposition.set("y", ele.position("y"));
      });
    });
  };

  const setSelectedElements = useStore.getState().setSelectedElements;
  const handleSetSelectedElements: cytoscape.EventHandler = () => {
    setSelectedElements(cy.$(":selected"));
  };

  cy.on("add remove", handleElementsAddRemove);
  cy.on("setdata", handleDataChange);
  cy.on("changedatakey", handleDataKeyChange);
  cy.on("position", handlePositionChange);
  cy.on("select unselect", "node, edge", handleSetSelectedElements);

  return () => {
    cy.off("add remove", handleElementsAddRemove);
    cy.off("setdata", handleDataChange);
    cy.off("changedatakey", handleDataKeyChange);
    cy.off("position", handlePositionChange);
    cy.off("select unselect", "node, edge", handleSetSelectedElements);
  };
};
