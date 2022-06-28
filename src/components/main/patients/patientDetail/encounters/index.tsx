// packages block
import { FC } from "react";
import { Box, Typography, Button, Card } from "@material-ui/core";
// styles, constants blocks
import { WHITE_FOUR } from "../../../../../theme";
import { getDateWithDay } from "../../../../../utils";
import { AppointmentsPayload } from "../../../../../generated/graphql";
import { VIEW, ENCOUNTERS, MINUTES } from "../../../../../constants";

interface EncounterPros {
  appointments: AppointmentsPayload['appointments']
}

const EncounterList: FC<EncounterPros> = ({ appointments }) => {
  return (
    <Card className="card-box-shadow">
      <Box p={3}>
        <Box mb={2}>
          <Typography variant="h3">{ENCOUNTERS}</Typography>
        </Box>

        {appointments?.map(encounter => {
          const { id, appointmentType, scheduleStartDateTime, provider, facility } = encounter || {};
          const { name } = facility || {}
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
                <Button type="submit" variant="contained" color="secondary">{VIEW}</Button>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Card>
  )
};

export default EncounterList;
