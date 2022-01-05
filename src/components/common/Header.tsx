// packages block
import { FC, MouseEvent, useContext, useState, } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { Help, NotificationsNone as NotificationIcon } from "@material-ui/icons";
import { Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography, Badge, AppBar, Input, TextField } from "@material-ui/core";
// history, app context, auth context, utils and header styles block
import history from "../../history";
import { AppContext, AuthContext } from "../../context";
import { notificationType } from "../../interfacesTypes";
import { useHeaderStyles } from "../../styles/headerStyles";
import { firstLatterUppercase, handleLogout } from "../../utils";
import { EMR } from "../../constants";
import { BellIcon, HelpIcon } from "../../assets/svgs";

const Header: FC = (): JSX.Element => {
  const classes = useHeaderStyles();
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const { isSidebarOpen, setIsSidebarOpen } = useContext(AppContext)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications] = useState<notificationType[]>([]);

  const handleDrawerOpen = () => setIsSidebarOpen(true)
  const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogoutButton = () => {
    handleMenuClose();
    setUser(null);
    handleLogout();
    setIsLoggedIn(false);
  }

  const dashboardText = firstLatterUppercase(history.location.pathname.substring(1)).split("/", 1).toString()
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
    <AppBar position="absolute" className={clsx(classes.appBar, isSidebarOpen && classes.appBarShift)}>
      <Toolbar className={classes.toolbar}>
        <Typography component="h1" variant="h4" color="inherit" noWrap className={classes.title}>
          <Box onClick={handleDrawerOpen} className={classes.cursor}>
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
