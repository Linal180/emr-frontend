import { FC } from 'react';
import { Box, Grid, Typography } from '@material-ui/core'
//component
import InputController from '../../../../../controller'
import DatePicker from '../../../../common/DatePicker';
//constants, interfaces
import { NOTES } from '../../../../../constants';
import { SocialSwitchCardPropsType } from '../../../../../interfacesTypes';


const SocialSwitchCard: FC<SocialSwitchCardPropsType> = ({ notesName, switchName, title, isDependentQ = false }): JSX.Element => {

  return (
    <Grid container alignItems="center" spacing={2} direction="row">
      <Grid item md={6} sm={12} xs={12}>
        <Box ml={isDependentQ ? 2 : 0}>
          <Typography variant="body1" color="initial">{title}</Typography>
        </Box>
      </Grid>

      <Grid item md={2} sm={6} xs={12}>
        <DatePicker label='' name={switchName} defaultValue={new Date()} />
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