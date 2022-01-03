// packages block
import { FC, MouseEvent, useContext, useState, } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { AccountCircle, Menu as MenuIcon, NotificationsNone as NotificationIcon } from "@material-ui/icons";
import { Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography, Badge, AppBar } from "@material-ui/core";
// history, app context, auth context, utils and header styles block
import history from "../../history";
import { AppContext, AuthContext } from "../../context";
import { firstLatterUppercase, handleLogout } from "../../utils";
import { useHeaderStyles } from "../../styles/headerStyles";
import { notificationType } from "../../interfacesTypes";

const Header: FC = (): JSX.Element => {
  const classes = useHeaderStyles();
  const { setIsLoggedIn, user, setUser } = useContext(AuthContext);
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
      <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
        Profile
      </MenuItem>

      <MenuItem onClick={handleLogoutButton}>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="absolute" className={clsx(classes.appBar, isSidebarOpen && classes.appBarShift)}>
      <Toolbar className={classes.toolbar}>
        <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} className={clsx(classes.menuButton, isSidebarOpen && classes.menuButtonHidden)}>
          <MenuIcon />
        </IconButton>

        <Typography component="h1" variant="h4" color="inherit" noWrap className={classes.title}>
          {dashboardText}
        </Typography>

        <Box>
          <div className={classes.dropdown}>
            <IconButton edge="start" color="inherit">
              <Badge badgeContent={notifications.length} color="secondary" className="customHeaderBadge">
                <NotificationIcon />
              </Badge>
              <div className={classes.dropdownContent}>
                {notifications.length === 0 ?
                  <Typography variant="h6" className={classes.link}>No New Notification</Typography>
                  :
                  notifications.map(({ url, message }, index) => (
                    <Link to={{ pathname: url, key: Math.random().toString(), state: { fromNotification: true } }} className={classes.link} key={index + message}>
                      <Typography variant="h6">{message}</Typography>
                    </Link>
                  ))}
              </div>
            </IconButton>
          </div>

          <Button aria-label="account of current user" aria-controls={menuId} aria-haspopup="true" onClick={handleProfileMenuOpen} color="primary">
            <Box className="header-account-button" display="flex">
              <AccountCircle />
              <Box ml={1} minWidth={100}>{`${user?.firstName || ""} ${user?.lastName || ""}`}</Box>
            </Box>
          </Button>

          {renderMenu}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
