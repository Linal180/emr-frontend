// packages block
import { FC, useContext, useState, } from "react";
import { Link } from "react-router-dom";
import { Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography, AppBar, TextField, Badge } from "@material-ui/core";
// history, app context, auth context, utils and header styles block
import { EMR, ROOT_ROUTE } from "../../constants";
import { handleLogout } from "../../utils";
import { BellIcon, HelpIcon } from "../../assets/svgs";
import { AuthContext } from "../../context";
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
    <AppBar position="absolute" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h4" color="inherit" noWrap component={Link} to={ROOT_ROUTE}>
          {EMR}
        </Typography>

        <Box flex={1} alignItems="center" display="flex" justifyContent="flex-end">
          <Box mr={1.25}>
            <TextField variant="outlined" placeholder="Global Search" />
          </Box>

          <Box mr={1.25}>
            <Badge color="secondary" variant="dot" anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
              <IconButton color="inherit" size="medium" className={classes.menuButton}>
                <BellIcon />
              </IconButton>
            </Badge>
          </Box>

          <Box mr={1.25}>
            <IconButton color="inherit" className={classes.menuButton}>
              <HelpIcon />
            </IconButton>
          </Box>

          <Button variant="contained" color="secondary">New Goal</Button>

          {renderMenu}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
