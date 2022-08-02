// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Card } from "@material-ui/core";
// components block
import NoDataComponent from "../../../../common/NoDataComponent";
// styles, constants blocks
import { WHITE_FOUR } from "../../../../../theme";
import { getDateWithDay } from "../../../../../utils";
import { EncounterPros } from "../../../../../interfacesTypes";
import { VIEW, ENCOUNTERS, MINUTES, APPOINTMENTS_ROUTE, CHECK_IN_ROUTE } from "../../../../../constants";

const EncounterList: FC<EncounterPros> = ({ appointments }) => {
  return (
    <Card className="card-box-shadow">
      <Box p={3}>
        <Box mb={2}>
          <Typography variant="h3">{ENCOUNTERS}</Typography>
        </Box>

        {appointments?.map(encounter => {
          const { id, appointmentType, scheduleStartDateTime, provider, facility, patient } = encounter || {};
          const { name } = facility || {}
          const { id: patientId } = patient || {}

          const { firstName, lastName } = provider || {}
          const { name: serviceName, duration } = appointmentType || {}

          return (
            <Box
              display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap"
              p={3} mb={3} border={`1px solid ${WHITE_FOUR}`} borderRadius={8} key={id}
            >
              <Box>
                <Typography variant="h6">{getDateWithDay(scheduleStartDateTime || '')}</Typography>

                <Box p={0.5} />

                <Typography variant="body1">{serviceName} ({duration} {MINUTES})</Typography>
                <Typography variant="body1">{firstName} {lastName}</Typography>

                {<Typography variant="body1"> {name} </Typography>}
              </Box>

              <Box display="flex" my={2}>
                <Link to={`${APPOINTMENTS_ROUTE}/${id}/${patientId}${CHECK_IN_ROUTE}`}>
                  <Button type="submit" variant="contained" color="secondary">{VIEW}</Button>
                </Link>
              </Box>
            </Box>
          )
        })}

        {!!!appointments?.length && <NoDataComponent />}
      </Box>
    </Card>
  )
};

export default EncounterList;
