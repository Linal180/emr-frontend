// packages block
import { FC } from "react";
import { Box, Typography } from "@material-ui/core";
import { BLUE, GRAY_SEVEN, WHITE } from "../../../theme";
// history, constant and styles block
import { UPCOMING_APPOINTMENT_LIST } from "../../../constants";

interface UpcomingAppointmentsProps {
  doctorId?: string;
  facilityId?: string
}

const UpcomingAppointments: FC<UpcomingAppointmentsProps> = ({ doctorId, facilityId }): JSX.Element => {

  return (
    <>
      {UPCOMING_APPOINTMENT_LIST.map((item) => {
        return (
          <Box mb={3} display='flex' justifyContent='space-between' alignItems='start'>
            <Box display='flex'>
              <Box
                bgcolor={!item.imageUrl && BLUE} color={WHITE} borderRadius={6} width={45} height={45} mr={2}
                display="flex" justifyContent="center" alignItems="center"
              >
                {
                  item.imageUrl ? <img src={item.imageUrl} alt={item.shortName} />
                    : <Typography variant="h6">{item.shortName}</Typography>
                }
              </Box>

              <Box>
                <Box>
                  <Typography variant="body1">{item.fullName}</Typography>
                </Box>

                <Box color={GRAY_SEVEN}>
                  <Typography variant="body1">{item.visitType}</Typography>
                </Box>
              </Box>
            </Box>

            <Box color={GRAY_SEVEN} fontWeight={700}>
              <Typography variant="inherit">{item.appointmentTime}</Typography>
            </Box>
          </Box>
        )
      })}
    </>
  )
};

export default UpcomingAppointments;
