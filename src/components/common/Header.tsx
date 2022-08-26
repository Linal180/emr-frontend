// packages block
import { Link } from "react-router-dom";
import { Menu as MenuIcon, } from "@material-ui/icons";
import { FC, MouseEvent, useContext, useState } from "react";
import { AppBar, Box, Button, Fade, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
// Components block
import DropdownMenu from "./DropdownMenu";
import ProfileDropdownMenu from "./ProfileDropdownMenu";
// utils and header styles block
import { BLACK } from "../../theme";
import history from "../../history";
import { AuthContext } from "../../context";
import { useHeaderStyles } from "../../styles/headerStyles";
import { AIMEDLOGO, SettingsIcon } from "../../assets/svgs";
import { activeClass, checkPermission, getHigherRole, isSuperAdmin } from "../../utils";
import {
  APPOINTMENT_MENU_ITEMS, BILLING_MENU_ITEMS, BILLING_TEXT, FACILITIES_ROUTE, FACILITIES_TEXT, HOME_TEXT,
  PATIENTS_ROUTE, PATIENTS_TEXT, PRACTICE_MANAGEMENT_ROUTE, PRACTICE_MANAGEMENT_TEXT, ROOT_ROUTE, SCHEDULE_TEXT,
  SETTINGS_ROUTE, SUPER_ADMIN, USER_PERMISSIONS
} from "../../constants";

const Header: FC = (): JSX.Element => {
  const classes = useHeaderStyles();
  const { user, currentUser, userPermissions, userRoles } = useContext(AuthContext);
  const { firstName, lastName } = currentUser || {}
  const { location: { pathname } } = history;

  const { roles } = user || {};
  const currentRoute = activeClass(pathname || '');
  const roleName = getHigherRole(userRoles) || ''
  const isSuper = isSuperAdmin(roles)

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuOpen = ({ currentTarget }: MouseEvent<HTMLElement>) =>
    setMobileMoreAnchorEl(currentTarget);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

  const renderMobileMenu = (
    <Menu
      id="mobile-menu"
      anchorEl={mobileMoreAnchorEl}
      keepMounted
      TransitionComponent={Fade}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Box className={classes.menuBar}>
          <Typography
            component={Link}
            to={ROOT_ROUTE}
            className={currentRoute === 'inDashboard' ? `${classes.mobileMenuItem} active` : `${classes.mobileMenuItem}`}
          >
            {HOME_TEXT}
          </Typography>

          {isSuper &&
            <Typography
              component={Link}
              to={PRACTICE_MANAGEMENT_ROUTE}
              className={currentRoute === 'inPractice' ? ` ${classes.mobileMenuItem} active` : `${classes.mobileMenuItem}`}
            >
              {PRACTICE_MANAGEMENT_TEXT}
            </Typography>
          }

          <Box className={classes.mobileMenuItem}>
            {checkPermission(userPermissions, USER_PERMISSIONS.findAllAppointments) &&
              <DropdownMenu
                itemName={SCHEDULE_TEXT}
                menuItem={APPOINTMENT_MENU_ITEMS}
                current={currentRoute === 'inAppointment'}
              />
            }
          </Box>

          {checkPermission(userPermissions, USER_PERMISSIONS.fetchAllPatients) &&
            <Typography
              component={Link}
              to={PATIENTS_ROUTE}
              className={currentRoute === 'inPatient' ? `${classes.mobileMenuItem} active` : `${classes.mobileMenuItem}`}
            >
              {PATIENTS_TEXT}
            </Typography>
          }

          <Box className={classes.mobileMenuItem}>
            <DropdownMenu
              itemName={BILLING_TEXT}
              menuItem={BILLING_MENU_ITEMS}
              current={currentRoute === 'inBilling'}
            />
          </Box>

          {checkPermission(userPermissions, USER_PERMISSIONS.findAllFacility) &&
            <Typography
              component={Link}
              to={FACILITIES_ROUTE}
              className={currentRoute === 'inFacility' ? ` ${classes.mobileMenuItem} active` : `${classes.mobileMenuItem}`}
            >
              {FACILITIES_TEXT}
            </Typography>
          }

          {/* <Typography
            component={Link}
            to={LAB_RESULTS_ROUTE}
            className={currentRoute === 'inReport' ? ` ${classes.mobileMenuItem} active` : `${classes.mobileMenuItem}`}
          >
            {REPORTS}
          </Typography> */}

          {/* <Typography
            component={Link}
            to={AGREEMENTS_ROUTE}
            className={currentRoute === 'isAgreement' ? ` ${classes.mobileMenuItem} active` : `${classes.mobileMenuItem}`}
          >
            {AGREEMENTS}
          </Typography> */}
        </Box>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <Link to={ROOT_ROUTE} className={classes.logo}>
            <AIMEDLOGO />
          </Link>

          <Box className={classes.grow} />

          <Box className={classes.sectionDesktop}>
            <Box className={classes.menuBar} display='flex' justifyContent='space-between' alignItems='center'>
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
                  className={currentRoute === 'inPatient' ? `${classes.menuItem} active` : `${classes.menuItem}`}
                >
                  {PATIENTS_TEXT}
                </Typography>
              }

              <DropdownMenu
                itemName={BILLING_TEXT}
                menuItem={BILLING_MENU_ITEMS}
                current={currentRoute === 'inBilling'}
              />

              {checkPermission(userPermissions, USER_PERMISSIONS.findAllFacility) &&
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

              {/* <Typography
                component={Link}
                to={AGREEMENTS_ROUTE}
                className={currentRoute === 'isAgreement' ? ` ${classes.menuItem} active` : `${classes.menuItem}`}
              >
                {AGREEMENTS}
              </Typography> */}
            </Box>
          </Box>

          <Box className={classes.grow} />

          <Box className="icon-button-hover" display="flex" alignItems="center">
            <Button onClick={() => history.push(SETTINGS_ROUTE)}>
              <SettingsIcon />
            </Button>

            <Box px={2} />

            <Box display="flex" alignItems="center" justifyContent="center">
              <Box display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="flex-end"
                maxWidth='200px'
              >
                {isSuper ?
                  <Typography variant="h6" color="textPrimary" noWrap>{SUPER_ADMIN}</Typography>
                  : (
                    <Box maxWidth="200px" textAlign="right">
                      <Box color={BLACK} minWidth='30px'>
                        <Box maxWidth={200}>
                          <Typography variant="h6" noWrap>{firstName} {lastName}</Typography>
                        </Box>
                        <Typography variant="body1" noWrap>{roleName}</Typography>
                      </Box>
                    </Box>
                  )}
              </Box>

              <ProfileDropdownMenu />
            </Box>
          </Box>

          <Box className={classes.sectionMobile}>
            <Button
              aria-label="dropdown menu"
              aria-controls="mobile-menu"
              aria-haspopup="true"
              color="inherit"
              onClick={(event) => handleMobileMenuOpen(event)}
            >
              <MenuIcon />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {renderMobileMenu}
    </>
  );
};

export default Header;
