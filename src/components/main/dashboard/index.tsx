// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@material-ui/core";
// svgs block
import { EMRIcon } from "../../../assets/svgs";
import { CALENDER, DASHBOARD_ROUTE } from "../../../constants";
import DASHBOARD_IMAGE from "../../../assets/images/dashboard-image.svg"

const DashboardComponent: FC = (): JSX.Element => (
  <Box pt={5}>
    <Box maxWidth={113} pb={2}>
      <EMRIcon />
    </Box>

    <Box pb={1}>
      <Typography component="h3" variant="h3">Welcome to EMR</Typography>
    </Box>

    <Box className="subHeading">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dolor interdum et risus. Accumsan.</Box>

    <Link to={`${DASHBOARD_ROUTE}/start-project`}>
      <Button color="primary" variant="contained" className="blue-button">{CALENDER}</Button>
    </Link>

    <Box position="absolute" right={150} bottom={40}>
      <img src={DASHBOARD_IMAGE} alt="" />
    </Box>
  </Box>
);

export default DashboardComponent;
