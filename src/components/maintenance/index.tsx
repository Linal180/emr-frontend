// packages block
import { FC } from 'react';
import { Box, Typography, Container } from "@material-ui/core";
// styles, context, history
import { useNetworkStyles } from "../../styles/networkStyles";
import { MAINTENANCE_IN_PROGRESS } from '../../constants';
import { EMR404Icon } from '../../assets/svgs';

const MaintenancePage: FC = (): JSX.Element => {
  const classes = useNetworkStyles();

  return (
    <Box className={classes.root}>
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" className={classes.textContainer}>

          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" position="absolute">
            <EMR404Icon />

            <Box maxWidth={500} pt={8} pb={2}>
              <Typography variant='body2' align='center'>{MAINTENANCE_IN_PROGRESS}</Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default MaintenancePage
