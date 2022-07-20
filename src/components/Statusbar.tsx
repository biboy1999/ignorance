import { useState } from "react";
import { ConnectionsModal } from "./modal/ConnectionsModal/ConnectionsModal";

export type StatusbarProp = {
  isOnlineMode: boolean;
};

export const Statusbar = ({ isOnlineMode }: StatusbarProp): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-0 right-0 left-0 flex flex-row-reverse h-fit bg-[#fafafd] border-solid border-t ">
      <div
        onClick={(): void => setIsOpen((state) => !state)}
        className={`font-mono text-white h-fit w-fit  cursor-pointer px-1 ${
          isOnlineMode
            ? "bg-green-500 hover:bg-green-300"
            : "bg-red-500 hover:bg-red-300"
        }`}
      >
        {isOnlineMode ? "Online " : "Local"}
      </div>
      <ConnectionsModal open={isOpen} setOpen={setIsOpen} />
    </div>
  );
};
