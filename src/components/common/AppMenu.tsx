// packages block
import { FC } from "react";
import { List, ListItemIcon, ListItemText } from "@material-ui/core";
// component block
import AppMenuItem from "./AppMenuItem";
import AppMenuItemComponent from "./AppMenuItemComponent";
// history, constant and styles block
import history from "../../history";
import { DashboardIcon } from "../../assets/svgs";
import { useAppMenuStyles } from "../../styles/appMenuStyles";
import { APP_MENU_ITEMS, DASHBOARD_ROUTE, DASHBOARD_TEXT } from "../../constants";

const AppMenu: FC = () => {
  const classes = useAppMenuStyles();
  const activeSidebarClass = DASHBOARD_ROUTE.includes(history.location.pathname.substring(1)?.split("/", 1).toString().toLowerCase().replaceAll("-", "")) ? 'active' : ''

  return (
    <List component="nav" disablePadding>
      <AppMenuItemComponent className={classes.menuItem} link={DASHBOARD_ROUTE}>
        <ListItemIcon className={activeSidebarClass === "active" ? `${classes.menuItemIcon} active` : classes.menuItemIcon}>
          <DashboardIcon />
        </ListItemIcon>

        <ListItemText primary={DASHBOARD_TEXT} className={activeSidebarClass} />
      </AppMenuItemComponent>

      {APP_MENU_ITEMS.map((item, index) => (
        <AppMenuItem {...item} key={index} />
      ))}
    </List>
  )
};

export default AppMenu;
