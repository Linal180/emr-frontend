// packages block
import { FC } from "react";
import { Link } from 'react-router-dom';
import { Box, Grid, MenuItem, Typography } from "@material-ui/core";
// component block
import CardComponent from "./CardComponent";
// constants, login styles and interfaces block
import history from "../../history";
import { WHITE } from "../../theme";
import { Children } from "../../interfacesTypes";
import { SettingsIcon, ShieldIcon } from "../../assets/svgs";
import { useHeaderStyles } from " ../../../src/styles/headerStyles";
import {
  USER_SETTINGS, GENERAL, PROFILE_GENERAL_MENU_ITEMS, SECURITY, PROFILE_SECURITY_MENU_ITEMS, AUTO_LOGOUT, AUTO_LOGOUT_ROUTE, TWO_FA_ROUTE, TWO_FA_TEXT
} from "../../constants";

const ProfileSettingsLayout: FC<Children> = ({ children }): JSX.Element => {
  const classes = useHeaderStyles();
  const { location: { pathname } } = history;
  let title = ''

  switch (pathname) {
    case AUTO_LOGOUT_ROUTE:
      title = AUTO_LOGOUT
      break;

      case TWO_FA_ROUTE:
      title = TWO_FA_TEXT
      break;
  }

  return (
    <Box mt={5}>
      <Grid container spacing={3}>
        <Grid item md={3} sm={12} xs={12}>
          <Box minHeight="calc(100vh - 170px)" bgcolor={WHITE}>
            <CardComponent cardTitle={USER_SETTINGS}>
              <Box display="flex">
                <SettingsIcon />

                <Box p={1} />

                <Typography variant='h6'>{GENERAL}</Typography>
              </Box>

              <Box p={2} className={classes.sidebarMenu}>
                {PROFILE_GENERAL_MENU_ITEMS.map(({ link, name }) =>
                  <Link key={`${link}-${name}`} to={link}>
                    <MenuItem>{name}</MenuItem>
                  </Link>
                )}
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

        <Grid item md={5} sm={12} xs={12}>
          <CardComponent cardTitle={title}>
            <Box p={2} mb={2}>
              {children}
            </Box>
          </CardComponent>
        </Grid>
      </Grid>
    </Box>
  )
};

export default ProfileSettingsLayout;