// packages block
import { useState, MouseEvent, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Typography, Grid, Box, Button, MenuItem, Menu, Fade, IconButton, colors, Avatar,
} from '@material-ui/core';
// utils and header styles block
import { AuthContext } from "../../context";
import { BLACK_TWO, WHITE_FOUR } from "../../theme";
import { useHeaderStyles } from "../../styles/headerStyles";
import { isOnlyDoctor, isSuperAdmin, isUserAdmin, onIdle } from "../../utils";
import { MenuSettingIcon, MenuShieldIcon, NewAvatarIcon, } from "../../assets/svgs";
import {
  EMAIL, FACILITY, GENERAL, LOCK_SCREEN, LOGOUT_TEXT, PRACTICE, PROFILE_GENERAL_MENU_ITEMS,
  PROFILE_SECURITY_MENU_ITEMS, SECURITY, SIGNATURE_TEXT, SUPER_ADMIN_TEXT,
} from "../../constants";

const ProfileDropdownMenu = (): JSX.Element => {
  const classes = useHeaderStyles();
  const {
    user, currentUser, setUser, setIsLoggedIn, setCurrentUser, practiceName, profileUrl, logoutUser
  } = useContext(AuthContext);

  const { email, roles, facility, } = user || {};
  const { firstName, lastName } = currentUser || {}
  const { name: facilityName } = facility || {}
  const [isSuper, setIsSuper] = useState<boolean>(false);

  const [isDoctor, setIsDoctor] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const FacilityAdmin = isUserAdmin(roles)

  const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleIdle = () => {
    email && localStorage.setItem(EMAIL, email)
    onIdle();
    setUser(null)
    setCurrentUser(null)
    setIsLoggedIn(false)
  }

  useEffect(() => {
    setIsSuper(isSuperAdmin(roles))
    setIsDoctor(isOnlyDoctor(roles))
  }, [isSuper, roles, user]);

  return (
    <>
      <IconButton
        aria-label="dropdown menu" aria-controls="menu-appBar" aria-haspopup="true" color="inherit"
        size='small' onClick={(event) => handleClick(event)}
      >
        {profileUrl ?
          <Avatar alt={`${firstName}-${lastName}`} src={profileUrl}></Avatar> :
          <NewAvatarIcon />
        }
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
        <Box px={2} pt={1} minWidth={360} maxWidth={360}>
          <Box p={1} mb={2} display="flex" justifyContent="space-between"
            alignItems="center" className={classes.dropdownMenuBar}
          >
            <Box display="flex" alignItems="center">
              {profileUrl ?
                <Avatar alt={`${firstName}-${lastName}`} src={profileUrl}></Avatar> :
                <NewAvatarIcon />
              }

              <Box ml={2}>
                {isSuper ?
                  <Typography variant="h6">{SUPER_ADMIN_TEXT}</Typography>
                  :
                  <Box maxWidth={200}>
                    <Typography variant="h6" noWrap>{firstName} {lastName}</Typography>
                  </Box>
                }
              </Box>
            </Box>
          </Box>

          {practiceName &&
            <Box display='flex' alignItems='center' borderBottom={`1px solid ${colors.grey[300]}`} mb={2} pt={1} pb={2}>
              <Box pr={1} color={BLACK_TWO}>
                <Typography variant="body1">{PRACTICE} :</Typography>
              </Box>

              <Box maxWidth={200}>
                <Typography variant="body1" noWrap>{practiceName}</Typography>
              </Box>
            </Box>}

          {!FacilityAdmin &&
            <Box display='flex' alignItems='center' borderBottom={`1px solid ${colors.grey[300]}`} mb={2} pt={1} pb={2}>
              <Box pr={1} color={BLACK_TWO}>
                <Typography variant="body1">{FACILITY} :</Typography>
              </Box>
               
              <Box maxWidth={200}>
                <Typography variant="body1" noWrap>{facilityName}</Typography>
              </Box>
            </Box>}

          <Grid container spacing={3}>
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

            <Grid item md={6}>
              <Box display="flex" alignItems="center">
                <MenuSettingIcon />

                <Box ml={1}>
                  <Typography variant="h5">{GENERAL}</Typography>
                </Box>
              </Box>

              <Box mt={1}>
                {PROFILE_GENERAL_MENU_ITEMS.map(({ link, name }) => {
                  if (name === SIGNATURE_TEXT) {
                    return isDoctor && <Link key={`${link}-${name}`} to={link}>
                      <MenuItem onClick={handleClose}>{name}</MenuItem>
                    </Link>
                  } else {
                    return <Link key={`${link}-${name}`} to={link}>
                      <MenuItem onClick={handleClose}>{name}</MenuItem>
                    </Link>
                  }
                })}
              </Box>
            </Grid>
          </Grid>

          <Box mt={2} pt={2} pb={1} borderTop={`1px solid ${WHITE_FOUR}`}>
            <Grid container spacing={3} alignItems="center">
              <Grid item md={8}>
                <Button onClick={() => handleIdle()} variant="contained" color="secondary" size="small" fullWidth>
                  {LOCK_SCREEN}
                </Button>
              </Grid>

              <Grid item md={4}>
                <Button onClick={() => logoutUser()} variant="outlined" color="inherit" size="small" className="danger">
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
