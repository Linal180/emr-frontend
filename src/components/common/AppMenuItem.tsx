// packages block
import { FC } from "react";
import { ListItemIcon, ListItemText, List, Accordion, AccordionDetails, AccordionSummary, Typography, Box } from "@material-ui/core";
// component block
import AppMenuItemComponent from "./AppMenuItemComponent";
import history from "../../history";
// styles and interface block
import { useAppMenuStyles } from "../../styles/appMenuStyles"
import { AppMenuItemProps } from "../../interfacesTypes"

const AppMenuItem: FC<AppMenuItemProps> = (props) => {
  const { name, link, Icon, items = [], sectionName } = props;
  const classes = useAppMenuStyles();
  const { location: { pathname } } = history
  const activeSidebarClass = name.toLowerCase().replaceAll(" ", "").includes(pathname.substring(1).split("/", 1).toString().toLowerCase().replaceAll("-", "")) ? 'active' : ''

  const MenuItemRoot = (
    <AppMenuItemComponent className={classes.menuItem} link={link}>
      {!!Icon && (
        <ListItemIcon className={activeSidebarClass === "active" ? `${classes.menuItemIcon} active` : classes.menuItemIcon}>
          <Icon />
        </ListItemIcon>
      )}

      <ListItemText primary={name} inset={!Icon} className={activeSidebarClass} />
    </AppMenuItemComponent>
  );

  const MenuItemChildren = (
    <List component="div" disablePadding>
      {items.map((childItem, index) => {
        const childItemActiveClass = pathname.split("-").join(" ").includes(childItem.name.toLowerCase()) ? "child-item active-child" : 'child-item';

        return (
          <AppMenuItemComponent link={childItem.link} key={index}>
            <ListItemText primary={childItem.name} inset={!Icon} className={childItemActiveClass} />
          </AppMenuItemComponent>
        )
      })}
    </List>
  )

  return (
    sectionName ?
      <Box pt={3} pb={0.5} px={3.37}>
        <Typography variant="body2" component="strong">{name}</Typography>
      </Box>
      :
      <Accordion elevation={0}>
        <AccordionSummary>
          {MenuItemRoot}
        </AccordionSummary>

        <AccordionDetails>
          {MenuItemChildren}
        </AccordionDetails>
      </Accordion>
  );
};

export default AppMenuItem;
