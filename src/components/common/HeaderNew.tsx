// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
import { AppBar, Typography, Box, Toolbar } from '@material-ui/core';
// Components block
import DropdownMenu from "./DropdownMenu";
// utils and header styles block
import { EMRLogo } from "../../assets/svgs";
import { useHeaderStyles } from "../../styles/headerStyles";
import {
  BILLING_TEXT, USERS_TEXT, SCHEDULE_TEXT, HOME_TEXT, REPORTS, HELLO_TEXT, RICHARD_TEXT, USER_MENU_ITEMS,
  APPOINTMENT_MENU_ITEMS, LAB_RESULTS_ROUTE, BILLING_MENU_ITEMS, Profile_MENU_ITEMS, FACILITIES_TEXT,
  FACILITIES_ROUTE, ROOT_ROUTE
} from "../../constants";

const HeaderNew: FC = (): JSX.Element => {
  const classes = useHeaderStyles();

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        <EMRLogo />

        <Box className={classes.menuBar}>
          <Typography component={Link} to={ROOT_ROUTE} className={classes.menuItem}>
            {HOME_TEXT}
          </Typography>

          <DropdownMenu itemName={SCHEDULE_TEXT} menuItem={APPOINTMENT_MENU_ITEMS} />
          <DropdownMenu itemName={USERS_TEXT} menuItem={USER_MENU_ITEMS} />
          <DropdownMenu itemName={BILLING_TEXT} menuItem={BILLING_MENU_ITEMS} />

          <Typography component={Link} to={FACILITIES_ROUTE} className={classes.menuItem}>
            {FACILITIES_TEXT}
          </Typography>

          <Typography component={Link} to={LAB_RESULTS_ROUTE} className={classes.menuItem}>
            {REPORTS}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="center">
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="right"  className={classes.profileItemName}>
            <Typography>
              {HELLO_TEXT}
            </Typography>

            <Typography variant="h6">{RICHARD_TEXT}</Typography>
          </Box>

          <DropdownMenu menuItem={Profile_MENU_ITEMS} avatarIcon={true} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderNew;
