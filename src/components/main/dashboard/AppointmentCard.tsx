import { Box, Button, Typography } from "@material-ui/core";
import { ALL_APPOINTMENTS, dummyAppointmentData, VIEW } from "../../../constants";
import CardComponent from "../../common/CardComponent";

const AppointmentCard = (): JSX.Element => {
  return(
    <CardComponent cardTitle={ALL_APPOINTMENTS}>
      {dummyAppointmentData.map( ({appTime, timeVariant, patientName, patientDOB, patientTel, patientStatus, patientElg}) => {
        return(
          
          <Box px={2} my={3} display="flex" flexDirection="column" className="solidLeftBorder">
            <Box display="flex" flexDirection="row">
              <Typography variant="h4">{appTime}</Typography>
              <Typography variant="body2">{timeVariant}</Typography>
            </Box>

            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Box alignSelf="flex-start">
                <Typography variant="subtitle1">{patientName}</Typography>
                <Typography variant="subtitle2">{patientDOB}</Typography>
                <Typography variant="subtitle2">{patientTel}</Typography>
              </Box>

              <Box pl={2} my={1} className="dashedLeftBorder">
                <Typography variant="subtitle2" color="primary">{patientStatus}</Typography>
                <Typography variant="subtitle2" color="secondary">{patientElg }</Typography>
              </Box>

              <Box my={1} justifyContent="flex-end">
                <Button variant="contained">{VIEW}</Button>
              </Box>
            </Box>
          </Box>
        )
      }
      )}

    </CardComponent>
  );
};

export default AppointmentCard;