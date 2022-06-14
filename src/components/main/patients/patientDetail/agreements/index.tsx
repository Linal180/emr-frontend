//packages import
import React from 'react'
import { Add as AddIcon, } from '@material-ui/icons';
import { Box, Typography, Button, } from '@material-ui/core';
//components import
import AgreementsTable from './agreementsTable';
import AddAgreementComponent from './addAgreement';

//constants, types, interfaces, utils import
import { ADD_NEW_TEXT, AGREEMENTS, DELETE, SAVE_TEXT, } from '../../../../../constants';

const AgreementsComponent = (): JSX.Element => {

  return (
    <>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" color='textPrimary'>{AGREEMENTS}</Typography>

        {/* <Button type="submit" variant="contained" color="primary">
          <AddIcon />
          {ADD_NEW_TEXT}
        </Button> */}

        <Box display="flex" alignItems="center">
          <Button variant="outlined" color="inherit" className='danger'>
            {DELETE}
          </Button>

          <Box p={1} />

          <Button type="submit" variant="contained" color="primary">
            {SAVE_TEXT}
          </Button>
        </Box>
      </Box>

      {/* <AgreementsTable /> */}
      <AddAgreementComponent />
    </>
  )
}

export default AgreementsComponent;
