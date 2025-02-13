// packages block
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from "@material-ui/core";
// styles, context, history
import { PasswordChangeIcon } from '../../../../assets/svgs';
import { useNetworkStyles } from "../../../../styles/networkStyles";
import { LOGIN_ROUTE, PASSWORD_CHANGE_HEADING_TEXT, PASSWORD_CHANGE_TEXT, SIGN_IN } from '../../../../constants';

const PasswordChange: FC = (): JSX.Element => {
  const classes = useNetworkStyles();

  return (
    <Box className={classes.root}>
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" className={classes.textContainer}>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" position="absolute">
            <Box maxWidth={500} pt={4} pb={2}>
              <Typography variant='h3' align='center'>{PASSWORD_CHANGE_HEADING_TEXT}</Typography>
            </Box>

            <Box maxWidth={500} pb={2}>
              <Typography variant='body2' align='center'>{PASSWORD_CHANGE_TEXT}</Typography>
            </Box>

            <Link to={LOGIN_ROUTE}>
              <Button variant="contained">
                {SIGN_IN}
              </Button>
            </Link>

            <Box pb={5} />
            <PasswordChangeIcon />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default PasswordChange
