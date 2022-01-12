// packages block
import { FC, MouseEvent, useState } from "react";
import { AccountCircle } from "@material-ui/icons";
import { Box, Drawer, Button, Menu, MenuItem } from "@material-ui/core";
import dotenv from "dotenv";
// components block
import AppMenu from "./AppMenu";
// utils, styles  block
import { handleLogout } from "../../utils";
import { useSidebarStyles } from "../../styles/sidebarStyles";
import { SettingIcon } from "../../assets/svgs"
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
      getContentAnchorEl={null}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "center" }}
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
      <Box minHeight="calc(100vh - 300px)" pt={2}>
        <AppMenu />
      </Box>
      <Box display="flex" flexDirection="column" alignItems="flex-start" pt={15} pb={1.5} width={'inherit'}>
        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" width={'inherit'}>
          <Box display="flex" minWidth={200} alignItems="center">
            <AccountCircle />
            <Box ml={1}>Administrator</Box>
          </Box>
          <Box display="flex">
            <Button aria-label="account of current user" aria-controls={menuId} aria-haspopup="true" onClick={handleProfileMenuOpen}>
              <SettingIcon />
            </Button>
          </Box>
          {renderMenu}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
