// packages block
import { useState, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Typography, Grid, Box, Button, MenuItem, Menu, Fade, IconButton } from '@material-ui/core';
// utils and header styles block
import { WHITE_FOUR } from "../../theme";
import { useHeaderStyles } from "../../styles/headerStyles";
import StatusSelector from "../main/dashboard/statusSelector";
import { MenuSettingIcon, MenuShieldIcon, NewAvatarIcon, } from "../../assets/svgs";
import { GENERAL, LOCK_SCREEN, LOGOUT_TEXT, PROFILE_GENERAL_MENU_ITEMS, PROFILE_SECURITY_MENU_ITEMS, SECURITY } from "../../constants";
import { handleLogout } from "../../utils";

const ProfileDropdownMenu = (): JSX.Element => {
  const classes = useHeaderStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        onClick={(event) => handleClick(event)}
        aria-label="dropdown menu"
        aria-controls="menu-appBar"
        aria-haspopup="true"
        color="inherit"
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
          <Box p={1} mb={2} display="flex" justifyContent="space-between" alignItems="center" className={classes.dropdownMenuBar}>
            <Box display="flex" alignItems="center">
              <NewAvatarIcon />

              <Box ml={1}>
                <Typography variant="h6">Richard Alvis</Typography>
              </Box>
            </Box>

            {/* Role should be here in future */}
            <StatusSelector />
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
                {PROFILE_GENERAL_MENU_ITEMS.map((item) => {
                  return (
                    <Link key={`${item.link}-${item.name}`} to={item.link}>
                      <MenuItem onClick={handleClose}>{item.name}</MenuItem>
                    </Link>
                  )
                })}
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
                {PROFILE_SECURITY_MENU_ITEMS.map((item) => {
                  return (
                    <Link key={`${item.link}-${item.name}`} to={item.link}>
                      <MenuItem onClick={handleClose}>{item.name}</MenuItem>
                    </Link>
                  )
                })}
              </Box>
            </Grid>
          </Grid>

          <Box mt={2} py={2} borderTop={`1px solid ${WHITE_FOUR}`}>
            <Grid container spacing={3}>
              <Grid item md={8}>
                <Button variant="contained" color="inherit" size="small" className="blue-button-new" fullWidth>{LOCK_SCREEN}</Button>
              </Grid>

              <Grid item md={4}>
                <Button onClick={() => handleLogout()} variant="outlined" color="secondary" size="small">{LOGOUT_TEXT}</Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Menu>
    </>
  )
}
export default ProfileDropdownMenu;