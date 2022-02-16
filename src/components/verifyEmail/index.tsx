// packages block
import { FC } from 'react';
import { Box, Typography, Button, Container } from "@material-ui/core";
// styles, context, history
import { useNetworkStyles } from "../../styles/networkStyles";
import { EMAIL_NOT_RECEIVE_TEXT, SKIP_NOW_TEXT, VERIFY_EMAIL_HEADING_TEXT, VERIFY_EMAIL_TEXT } from '../../constants';
import { VerifyEmailIcon } from '../../assets/svgs';

const VerifyEmail: FC = (): JSX.Element => {
  const classes = useNetworkStyles();

  return (
    <Box className={classes.root}>
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" className={classes.textContainer}>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" position="absolute">
            <Box maxWidth={500} pt={4} pb={2}>
              <Typography variant='h3' align='center'>{VERIFY_EMAIL_HEADING_TEXT}</Typography>
            </Box>
            <Box maxWidth={500} pb={2}>
              <Typography variant='body2' align='center'>{VERIFY_EMAIL_TEXT}</Typography>
            </Box>

            <Button variant="contained">
              {SKIP_NOW_TEXT}
            </Button>
            <Box maxWidth={500} pt={2} pb={4}>
              <Typography variant='h6' align='center'>{EMAIL_NOT_RECEIVE_TEXT}</Typography>
            </Box>
            <VerifyEmailIcon />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default VerifyEmail
