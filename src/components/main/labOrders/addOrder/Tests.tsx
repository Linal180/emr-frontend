// packages block
import { FC } from 'react';
import { FormProvider, useFieldArray, useForm, } from 'react-hook-form';
import { Box, Grid, Typography, } from '@material-ui/core';
import { DIAGNOSES, TEST_DATE, TEST_NOTES, TEST_TIME } from '../../../../constants';

// components block
import DatePicker from '../../../common/DatePicker';
import TimePicker from '../../../common/TimePicker';
import InputController from '../../../../controller';
import LabOrdersSpecimenTypeForm from './LabOrdersSpecimenTypeForm';
import DiagnosesSelector from '../../../common/Selector/DiagnosesSelector';

// interfaces, graphql, constants block
import { LabOrderCreateProps, LabOrdersCreateFormInput, } from "../../../../interfacesTypes";

const TestsComponent: FC<LabOrderCreateProps> = (): JSX.Element => {
  const methods = useForm<LabOrdersCreateFormInput>({
    mode: "all",
    defaultValues: {
      testField: [{
        test: { id: '12', name: '12' }
      },]
    }
  });

  const { control } = methods

  const { fields: testFields, } = useFieldArray({ control: control, name: "testField" });

  return (
    <Box  paddingX={3} paddingY={2}>
      <FormProvider {...methods}>
        <form>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Typography variant='h5'>Test Info (1 of 3)</Typography>
              <Typography variant='h5'>11084-1 - Reagin AB in Serum </Typography>
            </Grid>

            <Box p={2} />

            {testFields.map((_, index) => {
              return (
                <Box mb={4}>
                  <Box p={2}>
                    {/* <Box py={2} mb={5} display='flex' justifyContent='space-between' alignItems='center' borderBottom={`1px solid ${colors.grey[300]}`}>
                      <Typography variant='h4'>{TEST}</Typography>

                      {!!(testFields.length > 1 && index !== 0) && <Button onClick={() => removeTestField(index)} type="submit" variant="outlined" color="inherit" className='danger'>
                        {REMOVE_TEST}
                      </Button>}
                    </Box> */}

                    <Grid container spacing={1}>
                      <Grid item md={12} sm={12} xs={12}>
                        <Grid container spacing={3} direction='row'>
                          <Grid item md={6} sm={12} xs={12}>
                            <DatePicker name={`testField.${index}.testDate`} label={TEST_DATE} disableFuture={false} />
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <TimePicker
                              isRequired
                              label={TEST_TIME}
                              name={`testField.${index}.testTime`}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item md={12} sm={12} xs={12}>
                        <InputController
                          multiline
                          fieldType="text"
                          controllerName={`testField.${index}.testNotes`}
                          controllerLabel={TEST_NOTES}
                        />
                      </Grid>

                      <Grid item md={12} sm={12} xs={12}>
                        <DiagnosesSelector
                          isEdit={false}
                          label={DIAGNOSES}
                          name="diagnosesIds"
                          defaultValues={[]}
                        />
                      </Grid>

                      <Grid item md={12} sm={12} xs={12}>
                        <LabOrdersSpecimenTypeForm index={index} />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )
            })}
          </Grid>
        </form>
      </FormProvider>
    </Box>
  )
}

export default TestsComponent;

