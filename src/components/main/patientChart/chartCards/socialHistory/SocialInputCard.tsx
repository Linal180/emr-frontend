import { FC } from 'react'
import { Box, Grid, Typography } from '@material-ui/core'
//component
import InputController from '../../../../../controller'
//constants, interfaces
import { NOTES } from '../../../../../constants';
import { SocialInputCardPropsType } from '../../../../../interfacesTypes';


const SocialInputCard: FC<SocialInputCardPropsType> = ({ notesName, inputName, title, inputFieldType, notStep, isDependentQ = false }): JSX.Element => {
  return (
    <Grid container alignItems="center" spacing={2} direction="row">
      <Grid item md={6} sm={12} xs={12}>
        <Box ml={isDependentQ ? 3 : 0}>
          <Typography variant="body1" color="initial">{title}</Typography>
        </Box>
      </Grid>

      <Grid item md={2} sm={6} xs={12}>
        <InputController
          fieldType={inputFieldType}
          controllerName={inputName}
          defaultValue={''}
          notStep={notStep}
        />
      </Grid>

      <Grid item md={4} sm={6} xs={12}>
        <Box>
          <InputController
            fieldType="text"
            controllerName={notesName}
            placeholder={NOTES}
          />
        </Box>
      </Grid>
    </Grid>
  )
}

export default SocialInputCard