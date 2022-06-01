// packages block
import { Box, Card, Typography } from "@material-ui/core";
// common block
import ViewDataLoader from "../../../../common/ViewDataLoader";
// constants block
import { ADD_PROVIDER_INFORMATION, ADD_PROVIDER_TEXT, CARE_TEAM, PRIMARY_PROVIDER }
  from "../../../../../constants";
import { BLUE_FOUR, WHITE_FOUR } from "../../../../../theme";
import { formatValue } from "../../../../../utils";
import { CareTeamsProps } from "../../../../../interfacesTypes";
import { AddSlotIcon } from "../../../../../assets/svgs";
import { useDoctorScheduleStyles } from "../../../../../styles/doctorSchedule";

const CareTeamComponent = ({ toggleSideDrawer, loading, patientProvidersData }: CareTeamsProps): JSX.Element => {
  const classes = useDoctorScheduleStyles();

  const closeSlider = () => toggleSideDrawer && toggleSideDrawer()

  return (
    <Card className="card-box-shadow">
      <Box p={4}>

        <Box mb={2}>
          <Typography variant="h3" >{CARE_TEAM}</Typography>
        </Box>
        {(loading) ? (
          <ViewDataLoader columns={12} rows={2}/>
        ) : (patientProvidersData?.map((item) => {
          const { doctor, id, currentProvider } = item || {}
          const { email, firstName, lastName, speciality } = doctor || {}
          const doctorName = `${firstName} ${lastName}`
          return (
            <>
              <Box p={3} mb={3} border={`1px dotted ${WHITE_FOUR}`} borderRadius={8} key={id}>
                <Box mb={2} display="flex" justifyContent='space-between' flexWrap="wrap">
                  <Box display="flex" flexDirection='column'>
                    <Typography variant="h4">{doctorName}</Typography>

                    <Box py={0.2} />

                    <Typography variant="body1">{speciality && formatValue(speciality)}</Typography>

                    <Box py={0.2} />

                    <Typography variant="body1">{email}</Typography>
                  </Box>

                  {/* <EditNewIcon /> */}
                </Box>

                {currentProvider === true && <Box className={classes.status} component='span' color={BLUE_FOUR} border={`1px solid ${BLUE_FOUR}`}>
                  {PRIMARY_PROVIDER}
                </Box>}
              </Box>

            </>
          )
        }))}
        <Box onClick={closeSlider} className={classes.addProvider} display='flex'>
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
      </Box>
    </Card>
  )
}

export default CareTeamComponent;
