import { Box, Button, Card, Typography } from '@material-ui/core';
import { WHITE_TWO } from '../../../../../theme';
import { SLOT_CONFIRMATION_HEADING_TWO, SLOT_CONFIRMATION_SUB_HEADING, SLOT_CONFIRMATION_SUB_HEADING_TWO } from '../../../../../constants';

import { slotConfirmationStyles } from "../../../../../styles/publicAppointment/slotConfirmation"

const index = () => {
  const classes = slotConfirmationStyles();

  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card>
        <Box minHeight="580px" className={classes.container}>
          <Box maxWidth="700px">
            <Typography component="h3" variant="h3" >Thank you! Your visit at 8:15 am has been confirmed.</Typography>
            <Typography component="h3" variant="h3" >{SLOT_CONFIRMATION_HEADING_TWO}</Typography>
          </Box>

          <Box pt={3}>
            <Typography component="h5" variant="h5">{SLOT_CONFIRMATION_SUB_HEADING}</Typography>
            <Typography component="h5" variant="h5">{SLOT_CONFIRMATION_SUB_HEADING_TWO}</Typography>
          </Box>

          <Box display="flex" gridGap={20} mt={3}>
            <Button type="submit" variant="contained">
              Cancel Booking
            </Button>
            <Button type="submit" variant="contained" className='blue-button'>
              Select
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default index;
