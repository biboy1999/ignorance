import {
  FocusEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { nanoid } from "nanoid";
import { useStore } from "../../../store/store";
import { TabData } from "rc-dock";
import { SingularElementArgument } from "cytoscape";

export const AttributesEditor = (): JSX.Element => {
  const selectedElements = useStore((state) => state.selectedElements);
  const cy = useStore((state) => state.cytoscape);

  const [attributes, setAttributes] = useState<[string, string][]>([]);
  const [element, setElement] = useState<SingularElementArgument>();

  const addKeyInput = useRef<HTMLInputElement>(null);
  const addValueInput = useRef<HTMLInputElement>(null);

  const updateAttribute = (): void => {
    const element = selectedElements?.first();
    const data = Object.entries<string>(element?.data() ?? {}).filter(
      ([, v]) => v != null
    );
    setAttributes(Array.from<[string, string]>(data ?? []));
  };

  useEffect(() => {
    const element = selectedElements?.first();
    if (element == null) return;
    setElement(element);
    updateAttribute();
  }, [selectedElements]);

  cy?.on("data", () => {
    updateAttribute();
  });

  const commitChange = (
    key: string,
    type: string,
    target: HTMLInputElement
  ): void => {
    if (type === "key") {
      element?.changeDataKey(key, target.value);
      target.setAttribute("data-key", target.value);
      target.nextElementSibling?.setAttribute("data-key", target.value);
    } else if (type === "value") {
      element?.setData(key, target.value);
    }
  };

  const handleBlurCommit: FocusEventHandler<HTMLInputElement> = (e) => {
    const key = e.currentTarget.getAttribute("data-key");
    const type = e.currentTarget.getAttribute("data-type");

    if (key == null || type == null) return;
    commitChange(key, type, e.target);
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const key = e.currentTarget.getAttribute("data-key");
    const type = e.currentTarget.getAttribute("data-type");

    if (key == null || type == null) return;

    if (e.key === "Enter") {
      commitChange(key, type, e.currentTarget);
    } else if (e.key === "Escape") {
      e.currentTarget.value = e.currentTarget.defaultValue;
    }

    if (type === "value" && element?.data(key) === e.currentTarget.value) {
      e.currentTarget.classList.remove("bg-orange-300", "dark:bg-orange-900");
    } else {
      e.currentTarget.classList.add("bg-orange-300", "dark:bg-orange-900");
    }

    if (type === "key" && element?.data(key) === undefined) {
      e.currentTarget.classList.remove("bg-orange-300", "dark:bg-orange-900");
    } else {
      e.currentTarget.classList.add("bg-orange-300", "dark:bg-orange-900");
    }
  };

  const handleAddAttribute: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!(e.key === "Enter" && addKeyInput.current && addValueInput.current))
      return;

    const key = addKeyInput.current.value || `key-${nanoid(10)}`;
    const value = addValueInput.current.value || "new attribute";
    selectedElements?.setData(key, value);
    // clean up input
    addKeyInput.current.value = "";
    addKeyInput.current.blur();
    addValueInput.current.value = "";
    addValueInput.current.blur();

    updateAttribute();

    document.getElementById(`${element?.id()}-${key}-value`)?.focus();
  };

  return (
    <div className="styled-panel h-full w-full flex flex-col flex-1 overflow-auto divide-y border-b transition-colors p-0.5">
      {element?.length !== 0 &&
        attributes.map(([key, value]) => {
          return (
            <div key={nanoid()} className="flex divide-x transition-colors">
              <input
                id={`${element?.id()}-${key}-key`}
                data-key={key}
                data-type="key"
                className="flex-1 min-w-0 border-0 text-ellipsis"
                defaultValue={key}
                disabled={key === "id"}
                onKeyUp={handleKeyUp}
                onBlur={handleBlurCommit}
              />
              <input
                id={`${element?.id()}-${key}-value`}
                data-key={key}
                data-type="value"
                className="flex-1 min-w-0 border-0 text-ellipsis"
                defaultValue={value}
                disabled={key === "id"}
                onKeyUp={handleKeyUp}
                onBlur={handleBlurCommit}
              />
            </div>
          );
        })}
      {element?.length !== 0 && (
        <div className="flex divide-x dark:border-neutral-700 transition-colors">
          <input
            ref={addKeyInput}
            placeholder="Add Attribute"
            className="flex-1 min-w-0 border-b text-ellipsis"
            onKeyDown={handleAddAttribute}
          />
          <input
            ref={addValueInput}
            placeholder="Add value"
            className="flex-1 min-w-0 border-b text-ellipsis"
            onKeyDown={handleAddAttribute}
          />
        </div>
      )}
    </div>
  );
};

export const NodeAttributesTab: TabData = {
  id: "attributeseditor",
  title: "Attributes Editor",
  content: <AttributesEditor />,
  cached: true,
  closable: false,
};
