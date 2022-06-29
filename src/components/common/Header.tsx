// packages block
import { FC, useContext } from "react";
import { Link } from "react-router-dom";
import { AppBar, Typography, Box, Toolbar } from '@material-ui/core';
// Components block
import DropdownMenu from "./DropdownMenu";
import ProfileDropdownMenu from "./ProfileDropdownMenu";
// utils and header styles block
import history from "../../history";
import { AuthContext } from "../../context";
import { AIMEDLOGO, SettingsIcon } from "../../assets/svgs";
import { useHeaderStyles } from "../../styles/headerStyles";
import { activeClass, checkPermission, getHigherRole, isSuperAdmin, isUserAdmin } from "../../utils";
import {
  APPOINTMENT_MENU_ITEMS, FACILITIES_TEXT, SUPER_ADMIN, USER_PERMISSIONS, AGREEMENTS_ROUTE, AGREEMENTS,
  FACILITIES_ROUTE, ROOT_ROUTE, PRACTICE_MANAGEMENT_TEXT, PRACTICE_MANAGEMENT_ROUTE, SETTINGS_ROUTE,
  SCHEDULE_TEXT, HOME_TEXT, PATIENTS_ROUTE, PATIENTS_TEXT,
} from "../../constants";

const HeaderNew: FC = (): JSX.Element => {
  const classes = useHeaderStyles();
  const { user, currentUser, userPermissions, userRoles } = useContext(AuthContext);
  const { firstName, lastName } = currentUser || {}
  const { location: { pathname } } = history;

  const { roles } = user || {};
  const currentRoute = activeClass(pathname || '');
  const roleName = getHigherRole(userRoles) || ''

  const showFacility = isUserAdmin(roles)
  const isSuper = isSuperAdmin(roles)

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        <Link to={ROOT_ROUTE}>
          <AIMEDLOGO />
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

          {checkPermission(userPermissions, USER_PERMISSIONS.fetchAllPatients) &&
            <Typography
              component={Link}
              to={PATIENTS_ROUTE}
              className={currentRoute === 'inPatient' ? ` ${classes.menuItem} active` : `${classes.menuItem}`}
            >
              {PATIENTS_TEXT}
            </Typography>
          }

          {/* <DropdownMenu
            itemName={BILLING_TEXT}
            menuItem={BILLING_MENU_ITEMS}
            current={currentRoute === 'inBilling'}
          /> */}

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

          {/* <Typography
            component={Link}
            to={LAB_RESULTS_ROUTE}
            className={currentRoute === 'inReport' ? ` ${classes.menuItem} active` : `${classes.menuItem}`}
          >
            {REPORTS}
          </Typography> */}

          <Typography
            component={Link}
            to={AGREEMENTS_ROUTE}
            className={currentRoute === 'isAgreement' ? ` ${classes.menuItem} active` : `${classes.menuItem}`}
          >
            {AGREEMENTS}
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
                      <Typography variant="body1" className="text-overflow w-200">{roleName}</Typography>
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
