// packages block
import { FC } from 'react';
import { FormProvider, useForm, } from 'react-hook-form';
import { Box, Grid, } from '@material-ui/core';
import {
  APPOINTMENT_TEXT, EMPTY_OPTION, GUARANTOR, LAB_TEST_STATUSES, PRIMARY_PROVIDER, REFERRING_PROVIDER, STATUS, TEST
} from '../../../../constants';

// components block
import Selector from '../../../common/Selector';
import TestsSelector from '../../../common/Selector/TestSelector';
import DoctorSelector from '../../../common/Selector/DoctorSelector';
import AppointmentSelector from '../../../common/Selector/AppointmentSelector';
// interfaces, graphql, constants block
import { LabOrderCreateProps, LabOrdersCreateFormInput, } from "../../../../interfacesTypes";

const LabOrderComponent: FC<LabOrderCreateProps> = (): JSX.Element => {
  const methods = useForm<LabOrdersCreateFormInput>({
    mode: "all",
  });

  return (
    <Box  paddingX={3} paddingY={2}>
      <FormProvider {...methods}>
        <form>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <AppointmentSelector
                label={APPOINTMENT_TEXT}
                name="appointment"
                addEmpty
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Selector
                name="labTestStatus"
                label={STATUS}
                value={EMPTY_OPTION}
                options={LAB_TEST_STATUSES}
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Selector
                name="labTestStatus"
                label={GUARANTOR}
                value={EMPTY_OPTION}
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <DoctorSelector
                isRequired
                label={PRIMARY_PROVIDER}
                name="primaryProviderId"
                shouldOmitFacilityId
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <DoctorSelector
                isRequired
                label={REFERRING_PROVIDER}
                name="referringProviderId"
                shouldOmitFacilityId
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <TestsSelector
                label={TEST}
                name={''}
                // name={`testField.${index}.test`}
                addEmpty
              />
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Box>
  )
}

export default LabOrderComponent;

