// packages block
import { FC } from "react";
import { Box, Button, Typography } from "@material-ui/core";
// constants, login styles and interfaces block
import history from "../../history";
import { Children } from "../../interfacesTypes";
// constants block
import { WHITE_SEVEN } from "../../theme";
import { EMRLogo } from "../../assets/svgs";
import { BOOK_APPOINTMENT, BOOK_YOUR_APPOINTMENT, MORE_INFO, PAYMENT } from "../../constants";
import PublicAppointmentForm from "../main/publicAppointments/scheduleAppointments/publicAppointmentForm";

const ExternalLayout: FC<Children> = ({ children }): JSX.Element => {
  const { location: { pathname } } = history;
  let title = ''

  // switch (pathname) {
  //   case a:
  //   title = BOOK_YOUR_APPOINTMENT
  //   break;

  //   case b:
  //   title = PAYMENT
  //   break;

  //   case c:
  //     title = MORE_INFO
  //     break;
  // }

  return (
    <Box bgcolor={WHITE_SEVEN} minHeight="100vh" padding="30px 30px 30px 60px">
      <EMRLogo />

      <Box mb={3} />

      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Typography variant="h4">{BOOK_YOUR_APPOINTMENT}</Typography>

        <Button variant="contained" color="primary">{BOOK_APPOINTMENT}</Button>
      </Box>
    </Box>
  )
};

export default ExternalLayout;