// packages block
import { FC, useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import { Box, Grid, MenuItem, Typography } from "@material-ui/core";
// component block
import CardComponent from "./CardComponent";
// constants, login styles and interfaces block
import { AuthContext } from "../../context";
import { WHITE } from "../../theme";
import { Children } from "../../interfacesTypes";
import { isOnlyDoctor, isSuperAdmin, } from "../../utils";
import { SettingsIcon, ShieldIcon } from "../../assets/svgs";
import { useHeaderStyles } from " ../../../src/styles/headerStyles";
import { USER_SETTINGS, GENERAL, PROFILE_GENERAL_MENU_ITEMS, SECURITY, PROFILE_SECURITY_MENU_ITEMS, SIGNATURE_TEXT } from "../../constants";

const ProfileSettingsLayout: FC<Children> = ({ children }): JSX.Element => {
  const classes = useHeaderStyles();

  const { user } = useContext(AuthContext);
  const { roles } = user || {};
  const [isSuper, setIsSuper] = useState<boolean>(false);
  const [isDoctor, setIsDoctor] = useState<boolean>(false);
  const [, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    setIsSuper(isSuperAdmin(roles))
    setIsDoctor(isOnlyDoctor(roles))
  }, [isSuper, roles, user]);

  return (
    <Box mt={5}>
      <Grid container spacing={3}>
        <Grid item md={3} sm={12} xs={12}>
          <Box bgcolor={WHITE}>
            <CardComponent cardTitle={USER_SETTINGS}>
              <Box display="flex">
                <SettingsIcon />

                <Box p={1} />

                <Typography variant='h6'>{GENERAL}</Typography>
              </Box>

              <Box p={2} className={classes.sidebarMenu}>
                {PROFILE_GENERAL_MENU_ITEMS.map(({ link, name }) => {
                  if (name === SIGNATURE_TEXT) {
                    if (isDoctor) {
                      return <Link key={`${link}-${name}`} to={link}>
                        <MenuItem onClick={handleClose}>{name}</MenuItem>
                      </Link>
                    } else return null
                  } else {
                    return <Link key={`${link}-${name}`} to={link}>
                      <MenuItem onClick={handleClose}>{name}</MenuItem>
                    </Link>
                  }
                })}
              </Box>

              <Box mt={2} display="flex">
                <ShieldIcon />
                <Box p={1} />
                <Typography variant='h6'>{SECURITY}</Typography>
              </Box>

              <Box p={2} className={classes.sidebarMenu}>
                {PROFILE_SECURITY_MENU_ITEMS.map(({ link, name }) =>
                  <Link key={`${link}-${name}`} to={link}>
                    <MenuItem>{name}</MenuItem>
                  </Link>
                )}
              </Box>
            </CardComponent>
          </Box>
        </Grid>

        <Grid item md={8} sm={12} xs={12}>
          <Box bgcolor={WHITE}>
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
};

export default ProfileSettingsLayout;
