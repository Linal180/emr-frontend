// packages block
import { Box, Typography, Button, Card } from "@material-ui/core";
// styles, constants blocks
import { WHITE_FOUR } from "../../../../../theme";
import { VIEW, DUMMY_ENCOUNTERS, ENCOUNTERS } from "../../../../../constants";

const EncounterList = () => {
  return (
    <Card className="card-box-shadow">
      <Box p={3}>
        <Box mb={2}>
          <Typography variant="h3">{ENCOUNTERS}</Typography>
        </Box>

        {DUMMY_ENCOUNTERS?.map(encounter => {
          const { id, serviceName, scheduleDateTime, doctorName, duration, hospitalName } = encounter || {};

          return (
            <Box
              display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap"
              p={3} mb={3} border={`1px solid ${WHITE_FOUR}`} borderRadius={8} key={id}
            >
              <Box>
                <Typography variant="h6">{scheduleDateTime}</Typography>

                <Box p={0.5} />

                <Typography variant="body1">{serviceName} ({duration} Minutes)</Typography>

                <Typography variant="body1">{doctorName}</Typography>

                {<Typography variant="body1"> {hospitalName} </Typography>}
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
