import { useState } from "react";
import { ConnectionsModal } from "./modal/ConnectionsModal/ConnectionsModal";

export type StatusbarProp = {
  isOnlineMode: boolean;
};

export const Statusbar = ({ isOnlineMode }: StatusbarProp): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="styled-panel flex h-fit border-solid border-t divide-x">
      {/* TODO: possible message display */}
      <div className="flex-1"></div>
      <button
        onClick={(): void => setIsOpen((state) => !state)}
        className={`styled-button font-mono h-fit w-fit px-1 ${
          isOnlineMode
            ? "text-green-500 dark:text-green-600"
            : "text-red-500 dark:text-red-600"
        }`}
      >
        <span className="pr-1.5 align-text-bottom">●</span>
        {isOnlineMode ? "Online " : "Local"}
      </button>
      <ConnectionsModal open={isOpen} setOpen={setIsOpen} />
    </div>
  );
};
