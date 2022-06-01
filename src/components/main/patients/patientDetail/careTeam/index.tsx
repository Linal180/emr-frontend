// packages block
import { Box, Button, Card, TableCell, TableRow, Typography } from "@material-ui/core";
// common block
import TableLoader from "../../../../common/TableLoader";
// constants block
import { ADD_PROVIDER_INFORMATION, ADD_PROVIDER_TEXT, PRACTICE_DETAILS, CARE_TEAM }
  from "../../../../../constants";
import { WHITE_FOUR } from "../../../../../theme";
import { formatValue } from "../../../../../utils";
import { CareTeamsProps } from "../../../../../interfacesTypes";
import { DoctorPatient } from "../../../../../generated/graphql";
import { AddSlotIcon, EditNewIcon } from "../../../../../assets/svgs";
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
          <TableRow>
            <TableCell colSpan={5}>
              <TableLoader numberOfRows={3} numberOfColumns={5} />
            </TableCell>
          </TableRow>
        ) : (patientProvidersData?.map((item: DoctorPatient['doctor']) => {
          const { email, firstName, lastName, speciality, id } = item || {}
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

                  <EditNewIcon />
                </Box>

                <Button variant="outlined">{PRACTICE_DETAILS}</Button>
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
