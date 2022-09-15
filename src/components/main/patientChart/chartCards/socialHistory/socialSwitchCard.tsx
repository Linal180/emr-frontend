import { FC } from 'react'
import { Box, Grid, Typography } from '@material-ui/core'
//component
import InputController from '../../../../../controller'
import SwitchController from '../../../../../controller/SwitchController';
//constants, interfaces
import { NOTES } from '../../../../../constants';
import { SocialSwitchCardPropsType } from '../../../../../interfacesTypes';


const SocialSwitchCard: FC<SocialSwitchCardPropsType> = ({ notesName, switchName, title }): JSX.Element => {
  return (
    <Grid container alignItems="center" spacing={2} direction="row">
      <Grid item md={6} sm={12} xs={12}>
        <Box>
          <Typography variant="body1" color="initial">{title}</Typography>
        </Box>
      </Grid>

      <Grid item md={2} sm={6} xs={12}>
        <SwitchController controllerName={switchName} />
      </Grid>

      <Grid item md={4} sm={6} xs={12}>
        <Box>
          <InputController
            fieldType="text"
            placeholder={NOTES}
            controllerName={notesName}
          />
        </Box>
      </Grid>
    </Grid>
  )
}

export default SocialSwitchCard