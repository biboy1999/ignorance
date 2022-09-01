import { AbstractType, Map as YMap, YEvent, YMapEvent } from "yjs";
import { YElement } from "../types/yjs";
import { Elements } from "../types/types";
import { Position } from "cytoscape";

export const initYjsEvent = (
  yelements: YMap<YElement>,
  cy: cytoscape.Core
): (() => void) => {
  const handleElementsAddDelete = (e: YMapEvent<YElement>): void => {
    const addedElements: Elements[] = [];
    const removedElements: Elements[] = [];

    e.changes.keys.forEach((change, key) => {
      const element = yelements.get(key);
      if (change.action === "add" && element) {
        addedElements.push(element.toJSON() as Elements);
      } else if (change.action === "delete") {
        removedElements.push({ data: { id: key }, group: "edges" });
      }
    });

    if (addedElements.length) {
      cy.add(addedElements);
    }

    if (removedElements.length) {
      removedElements.forEach(
        (ele) => ele.data.id && cy.$id(ele.data.id).remove()
      );
    }
  };

  // TODO: maybe merge with handleElementsAddDelete
  // some event overlap
  const handleDataChange = (evts: YEvent<AbstractType<unknown>>[]): void => {
    evts.forEach((e) => {
      const [id, path] = e.path;
      const target = e.target as YMap<unknown>;

      // on key changed
      if (
        e.changes.keys.size === 2 &&
        Array.from(e.changes.keys.entries()).every(
          ([_k, action]) => ["delete", "add"].indexOf(action.action) > -1
        )
      ) {
        const [deletedKey] =
          Array.from(e.changes.keys.entries()).find(
            ([, v]) => v.action === "delete"
          ) ?? [];

        const [addedKey] =
          Array.from(e.changes.keys.entries()).find(
            ([, v]) => v.action === "add"
          ) ?? [];
        if (deletedKey == null || addedKey == null) return;
        const value = cy.$id(id.toString()).data(deletedKey);
        cy.$id(id.toString()).data(addedKey, value);
        cy.$id(id.toString()).removeData(deletedKey);
        return;
      }

      // on key remove add and value update
      e.changes.keys.forEach((action, key) => {
        if (action.action === "update" && path === "data") {
          cy.$id(id.toString()).data(key, target.get(key));
        } else if (action.action === "add" && path === "data") {
          // TODO: attribute add
        } else if (action.action === "delete" && path === "data") {
          // TODO: attribute remove
        } else if (action.action === "update" && path === "position") {
          // TODO: alternative position update, maybe with awareness
          cy.$id(id.toString()).position(target.toJSON() as Position);
        }
      });
    });
  };

  yelements.observe(handleElementsAddDelete);
  yelements.observeDeep(handleDataChange);

  return () => {
    yelements.unobserve(handleElementsAddDelete);
    yelements.unobserveDeep(handleDataChange);
  };
};
