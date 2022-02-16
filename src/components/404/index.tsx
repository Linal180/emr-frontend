// packages block
import { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from "@material-ui/core";
// styles, context, history
import { AuthContext } from "../../context";
import { useNetworkStyles } from "../../styles/networkStyles";
import { BACK_TO_HOME, FOUR_O_FOUR, LOGIN_ROUTE, NOTHING_HERE_TEXT, ROOT_ROUTE } from '../../constants';
import { EMR404Icon } from '../../assets/svgs';

const PageNotFound: FC = (): JSX.Element => {
  const classes = useNetworkStyles();
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Box className={classes.root}>
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" className={classes.textContainer}>
          <Typography component="h1" variant="h1" className={classes.pageNotFoundText} align='center'>{FOUR_O_FOUR}</Typography>

          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" position="absolute">
            <EMR404Icon />

            <Box maxWidth={500} pt={8} pb={2}>
              <Typography variant='body2' align='center'>{NOTHING_HERE_TEXT}</Typography>
            </Box>

            <Button variant="contained" component={Link} to={isLoggedIn ? ROOT_ROUTE : LOGIN_ROUTE} className={classes.link}>
              {BACK_TO_HOME}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default PageNotFound
