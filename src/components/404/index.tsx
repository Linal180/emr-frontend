// packages block
import { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from "@material-ui/core";
// styles, context, history
import { AuthContext } from "../../context";
import { useNetworkStyles } from "../../styles/networkStyles";
import { BACK_TO_HOME, FOUR_O_FOUR, LOGIN_ROUTE, LOOKS_LIKE_EMPTY, PAGE_NOT_FOUND, ROOT_ROUTE } from '../../constants';

const PageNotFound: FC = (): JSX.Element => {
  const classes = useNetworkStyles();
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Box className={classes.root}>
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" className={classes.textContainer}>
          <Typography color="primary" className={classes.pageNotFoundText} align='center'>{FOUR_O_FOUR}</Typography>

          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" position="absolute">
            <Typography color="primary" component="h1" variant="h1" align='center'>{PAGE_NOT_FOUND}</Typography>

            <Box maxWidth={500} pt={1} pb={4}>
              <Typography variant='body2' align='center'>{LOOKS_LIKE_EMPTY}</Typography>
            </Box>

            <Button variant="contained" color="primary" component={Link} to={isLoggedIn ? ROOT_ROUTE : LOGIN_ROUTE} className={classes.link}>
              {BACK_TO_HOME}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default PageNotFound
