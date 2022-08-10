// packages block
import { FC, useEffect } from 'react';
import { FormProvider, useFormContext, } from 'react-hook-form';
import { Box, Grid, Typography, } from '@material-ui/core';
// components block
import DatePicker from '../../../common/DatePicker';
import TimePicker from '../../../common/TimePicker';
import InputController from '../../../../controller';
import LabOrdersSpecimenTypeForm from './LabOrdersSpecimenTypeForm';
import DiagnosesSelector from '../../../common/Selector/DiagnosesSelector';
// interfaces, graphql, constants block
import { DIAGNOSES, TEST_DATE, TEST_NOTES, TEST_TIME } from '../../../../constants';
import { LabOrdersCreateFormInput, LabTestComponentProps, } from "../../../../interfacesTypes";

const TestsComponent: FC<LabTestComponentProps> = ({ currentTest }): JSX.Element => {
  const methods = useFormContext<LabOrdersCreateFormInput>();

  const { watch, setValue } = methods
  const { testFieldValues } = watch()
  const getTestFieldValues = testFieldValues.find((_, index) => index === currentTest)
  const { test, diagnosesIds, testDate, testNotes, testTime } = getTestFieldValues || {}
  const { name } = test || {}
  
  useEffect(() => {
    setValue(`testFieldValues.${currentTest}.testDate`, testDate || '')
    setValue(`testFieldValues.${currentTest}.testNotes`, testNotes || '')
    setValue(`testFieldValues.${currentTest}.testTime`, testTime || '')
  }, [currentTest, setValue, testDate, testNotes, testTime])

  return (
    <Box px={3} py={2} minHeight="calc(100vh - 170px)" className="overflowY-auto">
      <FormProvider {...methods}>
        <form>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Typography variant='h5'>Test Info ({currentTest + 1} of {testFieldValues.length})</Typography>
              <Typography variant='h5'>{name}</Typography>
            </Grid>

            <Box p={2} />

            <Box mb={4}>
              <Box p={2}>
                <Grid container spacing={1}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Grid container spacing={3} direction='row'>
                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name={`testFieldValues.${currentTest}.testDate`} label={TEST_DATE} disableFuture={false} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <TimePicker
                          isRequired
                          label={TEST_TIME}
                          name={`testFieldValues.${currentTest}.testTime`}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <InputController
                      multiline
                      fieldType="text"
                      controllerName={`testFieldValues.${currentTest}.testNotes`}
                      controllerLabel={TEST_NOTES}
                    />
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <DiagnosesSelector
                      isEdit={true}
                      label={DIAGNOSES}
                      name={`testFieldValues.${currentTest}.diagnosesIds`}
                      defaultValues={diagnosesIds}
                    />
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <LabOrdersSpecimenTypeForm index={currentTest} />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </form>
      </FormProvider>
    </Box>
  )
}

export default TestsComponent;

