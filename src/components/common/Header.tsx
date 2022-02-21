// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
import { AppBar, Typography, Box, Toolbar } from '@material-ui/core';
// components block
import DropdownMenu from "./DropdownMenu";
// utils and header styles block
import { EMRLogo } from "../../assets/svgs";
import { useHeaderStyles } from "../../styles/headerStyles";
import {
  BILLING_TEXT, USERS_TEXT, SCHEDULE_TEXT, HOME_TEXT, REPORTS, HELLO_TEXT, RICHARD_TEXT, USER_MENU_ITEMS,
  APPOINTMENT_MENU_ITEMS, LAB_RESULTS_ROUTE, BILLING_MENU_ITEMS, PROFILE_MENU_ITEMS, FACILITIES_TEXT,
  FACILITIES_ROUTE
} from "../../constants";

const HeaderNew: FC = (): JSX.Element => {
  const classes = useHeaderStyles();

  return (
    <AppBar className={classes.newAppBar}>
      <Toolbar className={classes.toolBar}>
        <EMRLogo />

        <Box className={classes.newMenuBar}>
          <Link to='/'>
            <Typography className={classes.menuItem}>
              {HOME_TEXT}
            </Typography>
          </Link>

          <DropdownMenu itemName={SCHEDULE_TEXT} menuItem={APPOINTMENT_MENU_ITEMS} />

          <DropdownMenu itemName={USERS_TEXT} menuItem={USER_MENU_ITEMS} />

          <DropdownMenu itemName={BILLING_TEXT} menuItem={BILLING_MENU_ITEMS} />

          <Link to={FACILITIES_ROUTE}>
            <Typography className={classes.menuItem}>
              {FACILITIES_TEXT}
            </Typography>
          </Link>

          <Link to={LAB_RESULTS_ROUTE}>
            <Typography className={classes.menuItem}>
              {REPORTS}
            </Typography>
          </Link>
        </Box>

        <Box display="flex" alignItems="center">
          <Box className={classes.profileItem}>
            <Typography className={classes.profileItemName}>
              {HELLO_TEXT}
            </Typography>

            <Typography variant="h6">{RICHARD_TEXT}</Typography>
          </Box>

          <DropdownMenu menuItem={PROFILE_MENU_ITEMS} avatarIcon={true} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderNew;
