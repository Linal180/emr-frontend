// packages block
import { FC } from "react";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { ListItemIcon, ListItemText, List, Divider, Collapse } from "@material-ui/core";
// component block
import AppMenuItemComponent from "./AppMenuItemComponent";
import history from "../../history";
// styles and interface block
import { useAppMenuStyles } from "../../styles/appMenuStyles"
import { AppMenuItemProps } from "../../interfacesTypes"

const AppMenuItem: FC<AppMenuItemProps> = (props) => {
  const { name, link, Icon, index, items = [], activeCollapse, setActiveCollapse } = props;
  const classes = useAppMenuStyles();
  const isExpandable = items && items.length > 0;
  const activeSidebarClass = name.toLowerCase().replaceAll(" ", "").includes(history.location.pathname.substring(1).split("/", 1).toString().toLowerCase().replaceAll("-", "")) || (isExpandable && activeCollapse === index) ? 'active' : ''

  const MenuItemRoot = (
    <AppMenuItemComponent
      className={classes.menuItem}
      link={link}
      onClick={() => setActiveCollapse && setActiveCollapse(index || 0)}
    >
      {!!Icon && (
        <ListItemIcon className={activeSidebarClass === "active" ? classes.menuItemIcon : ""}>
          <Icon />
        </ListItemIcon>
      )}

      <ListItemText primary={name} inset={!Icon} className={`${index === 2 || index === 5 ? classes.leftNavBar : ""}${activeSidebarClass}`} />
      {isExpandable && activeCollapse !== index && <ExpandMore />}
      {isExpandable && activeCollapse === index && <ExpandLess />}
    </AppMenuItemComponent>
  );

  const MenuItemChildren = isExpandable && (
    <Collapse in={activeCollapse === index} mountOnEnter unmountOnExit>
      <Divider />
      <List component="div" disablePadding>
        {items.map((item, index) => (
          <AppMenuItem {...item} key={index} />
        ))}
      </List>
    </Collapse>
  )

  return (
    <>
      {MenuItemRoot}
      {MenuItemChildren}
    </>
  );
};

export default AppMenuItem;
