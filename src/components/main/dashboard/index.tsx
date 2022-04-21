// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@material-ui/core";
// svgs block
import { EMRIcon } from "../../../assets/svgs";
import DASHBOARD_IMAGE from "../../../assets/images/dashboard-image.svg"
import { CALENDAR, CALENDAR_ROUTE, LOGIN_SUCCESSFULLY, LOREM_TEXT_15 } from "../../../constants";

const DashboardComponent: FC = (): JSX.Element => (
  <Box sx={{ p: 5 }}>
    <Box maxWidth={113} pb={2}>
      <EMRIcon />
    </Box>

    <Box pb={1}>
      <Typography component="h3" variant="h3">{LOGIN_SUCCESSFULLY}</Typography>
    </Box>

    <Box className="subHeading">{LOREM_TEXT_15}</Box>

    <Link to={`${CALENDAR_ROUTE}`}>
      <Button variant="contained" color="secondary">{CALENDAR}</Button>
    </Link>

    <Box display="flex" justifyContent="flex-end">
      <img src={DASHBOARD_IMAGE} alt="" />
    </Box>
  </Box>
);

export default DashboardComponent;
