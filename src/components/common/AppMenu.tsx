import React from "react";
import List from "@material-ui/core/List";
import {APP_MENU_ITEMS} from "../../constants"
import AppMenuItem from "./AppMenuItem";

const AppMenu: React.FC = () => {
  return (
    <List component="nav" disablePadding>
      {APP_MENU_ITEMS.map((item, index) => (
        <AppMenuItem {...item} key={index} />
      ))}
    </List>
  );
};

export default AppMenu;
