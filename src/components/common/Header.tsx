// packages block
import { FC, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Typography, Box, Toolbar } from '@material-ui/core';
// Components block
import DropdownMenu from "./DropdownMenu";
// utils and header styles block
import history from "../../history";
import { EMRLogo } from "../../assets/svgs";
import { AuthContext } from "../../context";
import { activeClass, formatValue, isSuperAdmin } from "../../utils";
import { useHeaderStyles } from "../../styles/headerStyles";
import {
  BILLING_TEXT, USERS_TEXT, SCHEDULE_TEXT, HOME_TEXT, REPORTS, HELLO_TEXT, USER_MENU_ITEMS,
  APPOINTMENT_MENU_ITEMS, LAB_RESULTS_ROUTE, BILLING_MENU_ITEMS, PROFILE_MENU_ITEMS, FACILITIES_TEXT,
  FACILITIES_ROUTE, ROOT_ROUTE, PRACTICE_MANAGEMENT_TEXT, PRACTICE_MANAGEMENT_ROUTE, SUPER_ADMIN, ADMIN
} from "../../constants";

const HeaderNew: FC = (): JSX.Element => {
  const classes = useHeaderStyles();
  const { user } = useContext(AuthContext);
  const { location: { pathname } } = history;
  const { roles } = user || {};
  const [isSuper, setIsSuper] = useState(false);
  const currentRoute = activeClass(pathname || '');

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

          <DropdownMenu
            itemName={SCHEDULE_TEXT}
            menuItem={APPOINTMENT_MENU_ITEMS}
            current={currentRoute === 'inAppointment'}
          />

          <DropdownMenu
            itemName={USERS_TEXT}
            menuItem={USER_MENU_ITEMS}
            current={currentRoute === 'inUser'}
          />

          <DropdownMenu
            itemName={BILLING_TEXT}
            menuItem={BILLING_MENU_ITEMS}
            current={currentRoute === 'inBilling'}
          />

          <Typography
            component={Link}
            to={FACILITIES_ROUTE}
            className={currentRoute === 'inFacility' ? ` ${classes.menuItem} active` : `${classes.menuItem}`}
          >
            {FACILITIES_TEXT}
          </Typography>

          <Typography
            component={Link}
            to={LAB_RESULTS_ROUTE}
            className={currentRoute === 'inReport' ? ` ${classes.menuItem} active` : `${classes.menuItem}`}
          >
            {REPORTS}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="center">
          <Box display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="right"
            className={classes.profileItemName}
          >
            <Typography>{HELLO_TEXT}</Typography>
            <Typography variant="h6">{isSuper ? formatValue(SUPER_ADMIN) : formatValue(ADMIN)}</Typography>
          </Box>

          <DropdownMenu menuItem={PROFILE_MENU_ITEMS} avatarIcon={true} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderNew;
