// packages block
// components block
import { Box, Button, Card, Typography } from "@material-ui/core";
// constants block
import { AddSlotIcon, EditNewIcon } from "../../../../../assets/svgs";
import { ADD_PROVIDER_INFORMATION, ADD_PROVIDER_TEXT, PRACTICE_DETAILS, PROVIDERS_DUMMY_DATA } from "../../../../../constants";
import { useDoctorScheduleStyles } from "../../../../../styles/doctorSchedule";

const CareTeamComponent = (): JSX.Element => {
  const classes = useDoctorScheduleStyles();

  return (
    <Box width="48%" mr={3} mt={3}>
      {PROVIDERS_DUMMY_DATA.map((item) => {
        return (
          <Box mb={3}>
            <Card>
              <Box p={4}>
                <Box mb={2} display="flex" justifyContent='space-between' flexWrap="wrap">
                  <Box ml={2} display="flex" flexDirection='column'>
                    <Typography variant="h4">{item.name}</Typography>
                    <Box py={0.2} />
                    <Typography variant="body1">{item.specialist}</Typography>
                  </Box>
                  <EditNewIcon />
                </Box>

                <Button variant="outlined">{PRACTICE_DETAILS}</Button>

              </Box>

              <Box className={classes.addProvider} my={2} display='flex' margin={2}>
                <Box mr={2}>
                  <AddSlotIcon />
                </Box>

                <Box>
                  <Typography variant="h6">
                    {ADD_PROVIDER_TEXT}
                  </Typography>

                  <Typography variant="body2">
                    {ADD_PROVIDER_INFORMATION}
                  </Typography>
                </Box>

              </Box>
            </Card>
          </Box>
        )
      })}
    </Box>
  )
}

export default CareTeamComponent;
