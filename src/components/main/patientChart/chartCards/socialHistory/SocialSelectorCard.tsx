import { FC } from 'react'
import { Box, Grid, Typography } from '@material-ui/core'
//component
import Selector from '../../../../common/Selector';
import InputController from '../../../../../controller'
//constants, interfaces
import { NOTES } from '../../../../../constants';
import { SocialSelectorCardPropsType } from '../../../../../interfacesTypes';


const SocialSelectorCard: FC<SocialSelectorCardPropsType> = ({ notesName, selectorName, selectorOptions, title, isDependentQ = false }): JSX.Element => {
  return (
    <Grid container alignItems="center" spacing={2} direction="row">
      <Grid item md={6} sm={12} xs={12}>
        <Box ml={isDependentQ ? 3 : 0}>
          <Typography variant="body1" color="initial">{title}</Typography>
        </Box>
      </Grid>

      <Grid item md={2} sm={6} xs={12}>
        <Selector
          label=''
          addEmpty
          name={selectorName}
          options={selectorOptions}
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

export default SocialSelectorCard