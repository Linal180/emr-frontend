//packages import
import React from 'react'
import { Add as AddIcon, } from '@material-ui/icons';
import { Box, Typography, Button, } from '@material-ui/core';
//components import

//constants, types, interfaces, utils import
import { ADD_NEW_TEXT, AGREEMENTS, } from '../../../../../constants';
import AgreementsTable from './agreementsTable';

const AgreementsComponent = (): JSX.Element => {

  return (
    <>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" color='textPrimary'>{AGREEMENTS}</Typography>

        <Button type="submit" variant="contained" color="primary">
          <AddIcon />
          {ADD_NEW_TEXT}
        </Button>
      </Box>

      <AgreementsTable />
    </>
  )
}

export default AgreementsComponent;
