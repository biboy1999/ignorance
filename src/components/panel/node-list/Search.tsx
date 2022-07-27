import { DotsVerticalIcon } from "@heroicons/react/solid";
import { useState } from "react";

type SearchProps = {
  onFilterChange: React.Dispatch<React.SetStateAction<string>>;
};

export const Search = ({ onFilterChange }: SearchProps): JSX.Element => {
  const [openAdvanced, setOpenAdvanced] = useState(false);
  return (
    <>
      <div className="flex items-center">
        <input
          className="flex-1 p-1 m-1 mr-0 min-w-0"
          type="text"
          id="filter"
          placeholder="node[name ^= value]"
          onChange={(e): void => onFilterChange(e.target.value)}
        />
        {/* TODO: Advanced setting */}
        <DotsVerticalIcon
          className="styled-svg svg-hover flex-shrink-0 h-5 w-5 p-1.5 cursor-pointer"
          onClick={(): void => setOpenAdvanced((prev) => !prev)}
        />
      </div>
      {openAdvanced && <div className="flex flex-col">TODO</div>}
    </>
  );
};
