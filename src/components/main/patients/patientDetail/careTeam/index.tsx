// packages block
import { WHITE_FOUR } from "../../../../../theme";
import { Box, Button, Card, Typography } from "@material-ui/core";
import { AddSlotIcon, EditNewIcon } from "../../../../../assets/svgs";
import { useDoctorScheduleStyles } from "../../../../../styles/doctorSchedule";
// constants block
import { ADD_PROVIDER_INFORMATION, ADD_PROVIDER_TEXT, PRACTICE_DETAILS, PROVIDERS_DUMMY_DATA, CARE_TEAM }
  from "../../../../../constants";

const CareTeamComponent = ({toggleSideDrawer}:any): JSX.Element => {
  const classes = useDoctorScheduleStyles();

  return (
    <Card className="card-box-shadow">
      <Box p={4}>

        <Box mb={2}>
          <Typography variant="h3" >{CARE_TEAM}</Typography>
        </Box>

        {PROVIDERS_DUMMY_DATA.map((item) => {
          return (
            <>
              <Box p={3} mb={3} border={`1px dotted ${WHITE_FOUR}`} borderRadius={8}>
                <Box mb={2} display="flex" justifyContent='space-between' flexWrap="wrap">
                  <Box display="flex" flexDirection='column'>
                    <Typography variant="h4">{item.name}</Typography>

                    <Box py={0.2} />
                    
                    <Typography variant="body1">{item.specialist}</Typography>
                  </Box>

                  <EditNewIcon />
                </Box>

                <Button variant="outlined">{PRACTICE_DETAILS}</Button>
              </Box>

              <Box onClick={toggleSideDrawer} className={classes.addProvider} display='flex'>
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
            </>
          )
        })}
      </Box>
    </Card>
  )
}

export default CareTeamComponent;
