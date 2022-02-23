// packages block
import { FC } from 'react';
import { Box, Typography, Container, Button } from "@material-ui/core";
// styles, context, history
import { EMR404Icon } from '../../assets/svgs';
import { MAINTENANCE_IN_PROGRESS, RELOAD } from '../../constants';
import { useNetworkStyles } from "../../styles/networkStyles";

const MaintenanceComponent: FC = (): JSX.Element => {
  const classes = useNetworkStyles();

  const handleReload = () => {
    window.location.pathname = '/'
  };

  return (
    <Box className={classes.root}>
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" className={classes.textContainer}>

          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" position="absolute">
            <EMR404Icon />

            <Box maxWidth={500} pt={8} pb={2}>
              <Typography variant='body2' align='center'>{MAINTENANCE_IN_PROGRESS}</Typography>
            </Box>

            <Button variant='contained' onClick={handleReload}>{RELOAD}</Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default MaintenanceComponent;
