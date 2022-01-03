// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
// constants, history, utils block
import { LEFT_NAV_LIST_ITEMS } from "../../constants";
import history from "../../history";
import { firstLatterUppercase } from "../../utils";

const mainListItems: FC = () => (
  <>
    {LEFT_NAV_LIST_ITEMS.map((nav, index) => {
      const leftNavClass = nav.title === firstLatterUppercase(history.location.pathname.substring(1)).split("/", 1).toString() ? 'left-side-nav active' : 'left-side-nav'

      return (
        <ListItem component={Link} to={nav.link} key={`${nav.title}-${index}`} className={leftNavClass}>
          <ListItemIcon>
            <nav.icon />
          </ListItemIcon>
          <ListItemText primary={nav.title} />
        </ListItem>
      )
    })}
  </>
)

export default mainListItems