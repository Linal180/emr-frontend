// packages block
import { FC, useState } from "react";
import List from "@material-ui/core/List";
// component block
import AppMenuItem from "./AppMenuItem";
// constant block
import { APP_MENU_ITEMS } from "../../constants";

const AppMenu: FC = () => {
  const [open, setOpen] = useState(0);

  return (
    <List component="nav" disablePadding>
      {APP_MENU_ITEMS.map((item, index) => (
        <AppMenuItem {...item} key={index} activeCollpase={open} setActiveCollapse={(item: number) => {
          if (item === open) setOpen(0);
          else setOpen(item);
        }} />
      ))}
    </List>
  )
};

export default AppMenu;
