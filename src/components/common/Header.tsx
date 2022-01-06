// packages block
import { FC, useContext, useState, } from "react";
import clsx from "clsx";
import { Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography, AppBar, TextField } from "@material-ui/core";
// history, app context, auth context, utils and header styles block
import { EMR } from "../../constants";
import { handleLogout } from "../../utils";
import { BellIcon, HelpIcon } from "../../assets/svgs";
import {  AuthContext } from "../../context";
import { useHeaderStyles } from "../../styles/headerStyles";

const Header: FC = (): JSX.Element => {
  const classes = useHeaderStyles();
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogoutButton = () => {
    handleMenuClose();
    setUser(null);
    handleLogout();
    setIsLoggedIn(false);
  };

  const isMenuOpen = Boolean(anchorEl);
  const menuId = "header-profile-menu";

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
      <MenuItem onClick={handleLogoutButton}>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar
      position="absolute"
      className={clsx(classes.appBar, classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <Typography component="h1" variant="h4" color="inherit" noWrap className={classes.title}>
          <Box className={classes.cursor}>
            {EMR}
          </Box>
        </Typography>

        <Box>
          <TextField variant="outlined" placeholder="Global Search" />
          <IconButton edge="start" color="inherit">
            <BellIcon />
          </IconButton>

          <IconButton edge="start" color="inherit">
            <HelpIcon />
          </IconButton>

          <Button variant="contained" color="secondary">New Goal</Button>
          {renderMenu}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
