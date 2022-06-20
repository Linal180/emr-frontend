// packages block
import { FC, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Typography, Box, Toolbar } from '@material-ui/core';
// Components block
import DropdownMenu from "./DropdownMenu";
import ProfileDropdownMenu from "./ProfileDropdownMenu";
// utils and header styles block
import history from "../../history";
import { AuthContext } from "../../context";
import { EMRLogo, SettingsIcon } from "../../assets/svgs";
import { useHeaderStyles } from "../../styles/headerStyles";
import { activeClass, checkPermission, getHigherRole, isSuperAdmin, isUserAdmin } from "../../utils";
import {
  APPOINTMENT_MENU_ITEMS, LAB_RESULTS_ROUTE, BILLING_MENU_ITEMS, FACILITIES_TEXT, SUPER_ADMIN,
  FACILITIES_ROUTE, ROOT_ROUTE, PRACTICE_MANAGEMENT_TEXT, PRACTICE_MANAGEMENT_ROUTE, SETTINGS_ROUTE,
  BILLING_TEXT, SCHEDULE_TEXT, HOME_TEXT, REPORTS, PATIENTS_ROUTE, PATIENTS_TEXT, USER_PERMISSIONS,
} from "../../constants";

const HeaderNew: FC = (): JSX.Element => {
  const classes = useHeaderStyles();
  const { user, currentUser, userPermissions, userRoles } = useContext(AuthContext);
  const { firstName, lastName } = currentUser || {}
  const { location: { pathname } } = history;
  const { roles } = user || {};
  const [isSuper, setIsSuper] = useState(false);
  const currentRoute = activeClass(pathname || '');
  const roleName = getHigherRole(userRoles) || ''
  const showFacility = isUserAdmin(roles)

  useEffect(() => {
    setIsSuper(isSuperAdmin(roles))
  }, [isSuper, roles, user]);

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        <Link to={ROOT_ROUTE}>
          <EMRLogo />
        </Link>

        <Box className={classes.menuBar}>
          <Typography
            component={Link}
            to={ROOT_ROUTE}
            className={currentRoute === 'inDashboard' ? ` ${classes.menuItem} active` : `${classes.menuItem}`}
          >
            {HOME_TEXT}
          </Typography>

          {isSuper &&
            <Typography
              component={Link}
              to={PRACTICE_MANAGEMENT_ROUTE}
              className={currentRoute === 'inPractice' ? ` ${classes.menuItem} active` : `${classes.menuItem}`}
            >
              {PRACTICE_MANAGEMENT_TEXT}
            </Typography>
          }

          {checkPermission(userPermissions, USER_PERMISSIONS.findAllAppointments) &&
            <DropdownMenu
              itemName={SCHEDULE_TEXT}
              menuItem={APPOINTMENT_MENU_ITEMS}
              current={currentRoute === 'inAppointment'}
            />
          }

          {checkPermission(userPermissions, USER_PERMISSIONS.findAllPatient) &&
            <Typography
              component={Link}
              to={PATIENTS_ROUTE}
              className={currentRoute === 'inPatient' ? ` ${classes.menuItem} active` : `${classes.menuItem}`}
            >
              {PATIENTS_TEXT}
            </Typography>
          }

          <DropdownMenu
            itemName={BILLING_TEXT}
            menuItem={BILLING_MENU_ITEMS}
            current={currentRoute === 'inBilling'}
          />

          {checkPermission(userPermissions, USER_PERMISSIONS.findAllFacility)
            && showFacility &&
            <Typography
              component={Link}
              to={FACILITIES_ROUTE}
              className={currentRoute === 'inFacility' ? ` ${classes.menuItem} active` : `${classes.menuItem}`}
            >
              {FACILITIES_TEXT}
            </Typography>
          }

          <Typography
            component={Link}
            to={LAB_RESULTS_ROUTE}
            className={currentRoute === 'inReport' ? ` ${classes.menuItem} active` : `${classes.menuItem}`}
          >
            {REPORTS}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center">
          <Link to={SETTINGS_ROUTE}>
            <Box pt={1} />

            <SettingsIcon />
          </Link>

          <Box px={3} />

          <Box display="flex" alignItems="center" justifyContent="center">
            <Box display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="flex-end"
              className={classes.profileItemName}
            >
              {isSuper ?
                <Typography variant="h6">{SUPER_ADMIN}</Typography>
                : (
                  <>
                    <Typography variant="h6">{firstName} {lastName}</Typography>

                    <Box className={classes.roleName}>
                      <Typography variant="body1">{roleName}</Typography>
                    </Box>
                  </>
                )}
            </Box>

            <ProfileDropdownMenu />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderNew;
