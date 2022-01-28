// packages block
import { FC, MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AccountCircle } from "@material-ui/icons";
import { Box, Drawer, Button, Menu, MenuItem } from "@material-ui/core";
import dotenv from "dotenv";
// components block
import AppMenu from "./AppMenu";
// utils, styles  block
import { handleLogout } from "../../utils";
import { useSidebarStyles } from "../../styles/sidebarStyles";
import { SettingIcon } from "../../assets/svgs"
import { SETTINGS_ROUTE } from "../../constants";
dotenv.config();

const Sidebar: FC = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const classes = useSidebarStyles();
  const isMenuOpen = Boolean(anchorEl);
  const menuId = "header-profile-menu";
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

  const renderMenu = (
    <Menu
      classes={
        { paper: "user-setting-menu" }
      }
      getContentAnchorEl={null}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogout}>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <Drawer variant="permanent" classes={{ paper: classes.drawerPaper }} open={true}>
      <Box pt={2} className={classes.appMenuContainer}>
        <AppMenu />
      </Box>

      <Box display="flex" alignItems="center" justifyContent='space-between' pb={1.5} pl={3.375} pr={1.5}>
        <Box display="flex" alignItems="center">
          <Button aria-label="account of current user" aria-controls={menuId} aria-haspopup="true" onClick={handleProfileMenuOpen}>
            <AccountCircle />
          </Button>
          <Box ml={1}>Administrator</Box>
        </Box>

        <Link to={SETTINGS_ROUTE}>
          <SettingIcon />
        </Link>
        {renderMenu}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
