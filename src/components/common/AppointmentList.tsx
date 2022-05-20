// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@material-ui/core";
// interfaces, constants, utils blocks
import { WHITE_FOUR } from "../../theme";
import { getAppointmentDateTime } from "../../utils";
import { AppointmentListProps } from "../../interfacesTypes";
import { Appointmentstatus } from "../../generated/graphql"
import {
  RE_SCHEDULE, CHECK_IN, APPOINTMENTS_ROUTE, SCHEDULE_WITH_DOCTOR, SCHEDULED_IN_FACILITY
} from "../../constants";

const AppointmentList: FC<AppointmentListProps> = ({ appointments, type }) => {

  return (
    <Box>
      {appointments?.map(appointment => {
        const { id, scheduleStartDateTime, appointmentType, provider, facility } = appointment || {};
        const { firstName, lastName } = provider || {};
        const { name: facilityName } = facility || {};
        const { duration, name: serviceName } = appointmentType || {};

        return (
          <Box
            display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap"
            p={3} mb={3} border={`1px solid ${WHITE_FOUR}`} borderRadius={8} key={id}
          >
            <Box>
              <Typography variant="h6">{getAppointmentDateTime(scheduleStartDateTime || '')}</Typography>

              <Box p={0.5} />

              <Typography variant="body1">{serviceName} ({duration} Minutes)</Typography>

              {provider && <Typography variant="body1">{SCHEDULE_WITH_DOCTOR} {firstName} {lastName}</Typography>}

              {!provider && facility && <Typography variant="body1">{SCHEDULED_IN_FACILITY} {facilityName}</Typography>}
            </Box>

            {type === Appointmentstatus.Initiated &&
              <Box display="flex" my={2}>
                <Link to={`${APPOINTMENTS_ROUTE}/${id}`}>
                  <Button type="submit" variant="outlined" color="default">{RE_SCHEDULE}</Button>
                </Link>

                <Box p={1} />

                <Button type="submit" variant="contained" color="secondary">{CHECK_IN}</Button>
              </Box>
            }
          </Box>
        )
      })}
    </Box>
  )
};

export default AppointmentList;
