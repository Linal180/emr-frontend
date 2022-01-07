// packages block
import { FC, useState } from "react";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { ListItemIcon, ListItemText, List, Divider, Collapse } from "@material-ui/core";
// component block
import AppMenuItemComponent from "./AppMenuItemComponent";
// styles and interface block
import { useAppMenuStyles } from "../../styles/appMenuStyles"
import { AppMenuItemProps } from "../../interfacesTypes"

const AppMenuItem: FC<AppMenuItemProps> = (props) => {
  const { name, link, Icon, index, items = [] } = props;
  const classes = useAppMenuStyles();
  const isExpandable = items && items.length > 0;
  const [open, setOpen] = useState(false);

  function handleClick() {
    setOpen(!open);
  }

  const MenuItemRoot = (
    <AppMenuItemComponent
      className={classes.menuItem}
      link={link}
      onClick={handleClick}
    >
      {!!Icon && (
        <ListItemIcon className={classes.menuItemIcon}>
          <Icon />
        </ListItemIcon>
      )}

      <ListItemText primary={name} inset={!Icon} className={index === 2 || index === 5 ? classes.leftNavBar : ""} />
      {isExpandable && !open && <ExpandMore />}
      {isExpandable && open && <ExpandLess />}
    </AppMenuItemComponent>
  );

  const MenuItemChildren = isExpandable && (
    <Collapse in={open} timeout="auto" unmountOnExit>
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
