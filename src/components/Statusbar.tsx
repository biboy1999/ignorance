import { useState } from "react";
import { ConnectionsModal } from "./modal/ConnectionsModal/ConnectionsModal";

export type StatusbarProp = {
  isOnlineMode: boolean;
};

export const Statusbar = ({ isOnlineMode }: StatusbarProp): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-row-reverse h-fit bg-purple-400">
      <div
        onClick={(): void => setIsOpen((state) => !state)}
        className={`font-mono text-white h-fit w-fit  cursor-pointer ${
          isOnlineMode
            ? "bg-green-500 hover:bg-green-400"
            : "bg-red-500 hover:bg-red-400"
        }`}
      >
        {isOnlineMode ? "Online " : "Local"}
      </div>
      <ConnectionsModal open={isOpen} setOpen={setIsOpen} />
    </div>
  );
};
