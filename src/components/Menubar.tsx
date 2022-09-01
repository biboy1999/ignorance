import { Menu, MenuItem } from "./common/DropDownMenu";

// TODO: Menubar
export const Menubar = (): JSX.Element => {
  return (
    <div className="styled-panel flex h-fit border-solid border-b divide-x">
      <Menu label="File">
        <MenuItem label="Load" />
        <MenuItem label="Save" />
      </Menu>
      <Menu label="Windows">
        <MenuItem label="Graph Navigator" />
        <MenuItem label="Attribute Editor" />
        <MenuItem label="Transform Jobs" />
        <MenuItem label="Shared Transforms" />
        <MenuItem label="Node List" />
        <MenuItem label="User Info" />
        <MenuItem label="Debug" />
      </Menu>
    </div>
  );
};
