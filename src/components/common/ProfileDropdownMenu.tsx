// packages block
import { useState, MouseEvent, useContext } from "react";
import { Link } from "react-router-dom";
import { Typography, Grid, Box, Button, MenuItem, Menu, Fade, IconButton, colors, } from '@material-ui/core';
// utils and header styles block
import { BLACK_TWO, WHITE_FOUR } from "../../theme";
import { handleLogout, onIdle } from "../../utils";
import { AuthContext } from "../../context";
import { useHeaderStyles } from "../../styles/headerStyles";
import { MenuSettingIcon, MenuShieldIcon, NewAvatarIcon, } from "../../assets/svgs";

import {
  EMAIL,
  GENERAL, LOCK_SCREEN, LOGOUT_TEXT, PRACTICE, PROFILE_GENERAL_MENU_ITEMS, PROFILE_SECURITY_MENU_ITEMS, SECURITY
} from "../../constants";

const ProfileDropdownMenu = (): JSX.Element => {
  const classes = useHeaderStyles();
  const { user, setUser, setIsLoggedIn } = useContext(AuthContext);
  const { email } = user || {};
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleIdle = () => {
    email && localStorage.setItem(EMAIL, email)
    onIdle();
    setUser(null)
    setIsLoggedIn(false)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
    handleLogout();
  };

  return (
    <>
      <IconButton
        aria-label="dropdown menu" aria-controls="menu-appBar" aria-haspopup="true" color="inherit"
        onClick={(event) => handleClick(event)}
      >
        <NewAvatarIcon />
      </IconButton>

      <Menu
        id="menu-appBar"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box px={2} pt={1} minWidth={350}>
          <Box p={1} mb={2} display="flex" justifyContent="space-between"
            alignItems="center" className={classes.dropdownMenuBar}
          >
            <Box display="flex" alignItems="center">
              <NewAvatarIcon />

              <Box ml={2}>
                <Typography variant="h6">Richard Alvis</Typography>
              </Box>
            </Box>
          </Box>

          <Box display='flex' alignItems='center' borderBottom={`1px solid ${colors.grey[300]}`} mb={2} pt={1} pb={2}>
            <Box pr={1} color={BLACK_TWO}>
              <Typography variant="body1">{PRACTICE} :</Typography>
            </Box>

            <Typography variant="body1">Express Medical Center</Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item md={6}>
              <Box display="flex" alignItems="center">
                <MenuSettingIcon />

                <Box ml={1}>
                  <Typography variant="h5">{GENERAL}</Typography>
                </Box>
              </Box>

              <Box mt={1}>
                {PROFILE_GENERAL_MENU_ITEMS.map(({ link, name }) =>
                  <Link key={`${link}-${name}`} to={link}>
                    <MenuItem onClick={handleClose}>{name}</MenuItem>
                  </Link>
                )}
              </Box>
            </Grid>

            <Grid item md={6}>
              <Box display="flex" alignItems="center">
                <MenuShieldIcon />

                <Box ml={1}>
                  <Typography variant="h5">{SECURITY}</Typography>
                </Box>
              </Box>

              <Box mt={1}>
                {PROFILE_SECURITY_MENU_ITEMS.map(({ name, link }) =>
                  <Link key={`${link}-${name}`} to={link}>
                    <MenuItem onClick={handleClose}>{name}</MenuItem>
                  </Link>
                )}
              </Box>
            </Grid>
          </Grid>

          <Box mt={2} py={2} borderTop={`1px solid ${WHITE_FOUR}`}>
            <Grid container spacing={3}>
              <Grid item md={8}>
                <Button onClick={() => handleIdle()} variant="contained" color="inherit" size="small" className="blue-button-new" fullWidth>
                  {LOCK_SCREEN}
                </Button>
              </Grid>

              <Grid item md={4}>
                <Button onClick={() => logout()} variant="outlined" color="secondary" size="small"
                >
                  {LOGOUT_TEXT}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Menu>
    </>
  )
}

export default ProfileDropdownMenu;
