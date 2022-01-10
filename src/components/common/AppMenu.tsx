// packages block
import { FC } from "react";
import List from "@material-ui/core/List";
// component block
import AppMenuItem from "./AppMenuItem";
// constant block
import { APP_MENU_ITEMS } from "../../constants";

const AppMenu: FC = () => (
  <List component="nav" disablePadding>
    {APP_MENU_ITEMS.map((item, index) => (
      <AppMenuItem {...item} key={index} />
    ))}
  </List>
);

export default AppMenu;
