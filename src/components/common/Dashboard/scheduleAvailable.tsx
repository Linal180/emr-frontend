// packages block
import { FC } from "react";
import { Box, Grid, IconButton, Typography } from "@material-ui/core";
import { GREY_EIGHT, GREY_FIFTEEN, GREY_FOURTEEN, WHITE_FOUR } from "../../../theme";
// components
// history, constant and styles block
import { FormAddIcon, RedirectIcon } from "../../../assets/svgs";
import { ADD_RECORD, APPT_TYPE, AVAILABILITY_SCHEDULE, FROM_TEXT, TO_TEXT, } from "../../../constants";

const ScheduleAvailableComponent: FC = (): JSX.Element => {

  return (
    <>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant="h5">{AVAILABILITY_SCHEDULE}</Typography>

        <IconButton>
          <RedirectIcon />
        </IconButton>
      </Box>

      <Box
        py={1} mb={3} bgcolor={GREY_FOURTEEN} borderRadius={6} border={`1px dashed ${WHITE_FOUR}`}
        display='flex' alignItems='center' justifyContent='center' className="pointer-cursor"
      >
        <Box bgcolor={GREY_EIGHT} borderRadius={6} px={1} py={0.5} mr={1}>
          <FormAddIcon />
        </Box>

        <Box ml={0.5} color={GREY_FIFTEEN}>
          <Typography variant="h5">{ADD_RECORD}</Typography>
        </Box>
      </Box>

      <Box py={1.2} px={2} mb={3} borderRadius={6} border={`1px dashed ${WHITE_FOUR}`}>
        <Typography variant="h6">MONDAY</Typography>

        <Box mt={1} px={1}>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <Box display='flex' alignItems='center'>
                <Typography variant="body2">{FROM_TEXT}</Typography>

                <Box ml={0.5} fontSize={12} fontWeight={700} color={GREY_FIFTEEN}>
                  <Typography variant="inherit">08:00 AM</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Box display='flex' alignItems='center'>
                <Typography variant="body2">{TO_TEXT}</Typography>

                <Box ml={0.5} fontSize={12} fontWeight={700} color={GREY_FIFTEEN}>
                  <Typography variant="inherit">12:00 PM</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box mt={1} display='flex' alignItems='center'>
            <Typography variant="body2">{APPT_TYPE}</Typography>

            <Box ml={0.5} fontSize={12} fontWeight={700} color={GREY_FIFTEEN}>
              <Typography variant="inherit">General Visit</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box py={1.2} px={2} mb={3} borderRadius={6} border={`1px dashed ${WHITE_FOUR}`}>
        <Typography variant="h6">MONDAY</Typography>

        <Box mt={1} px={1}>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <Box display='flex' alignItems='center'>
                <Typography variant="body2">{FROM_TEXT}</Typography>

                <Box ml={0.5} fontSize={12} fontWeight={700} color={GREY_FIFTEEN}>
                  <Typography variant="inherit">08:00 AM</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Box display='flex' alignItems='center'>
                <Typography variant="body2">{TO_TEXT}</Typography>

                <Box ml={0.5} fontSize={12} fontWeight={700} color={GREY_FIFTEEN}>
                  <Typography variant="inherit">12:00 PM</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box mt={1} display='flex' alignItems='center'>
            <Typography variant="body2">{APPT_TYPE}</Typography>

            <Box ml={0.5} fontSize={12} fontWeight={700} color={GREY_FIFTEEN}>
              <Typography variant="inherit">General Visit</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
};

export default ScheduleAvailableComponent;
