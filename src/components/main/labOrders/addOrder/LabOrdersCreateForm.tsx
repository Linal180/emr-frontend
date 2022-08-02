// packages block
import { FC } from 'react';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Box, Card, colors, Grid, Typography, Button, CircularProgress, } from "@material-ui/core";
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
// components block
import LabOrdersSpecimenTypeForm from './LabOrdersSpecimenTypeForm';
import Selector from '../../../common/Selector';
import AppointmentSelector from '../../../common/Selector/AppointmentSelector';
import DiagnosesSelector from '../../../common/Selector/DiagnosesSelector';
import TestsSelector from '../../../common/Selector/TestSelector';
import TimePicker from '../../../common/TimePicker';
import DatePicker from '../../../common/DatePicker';
import InputController from '../../../../controller';
// interfaces, graphql, constants block
import { LabOrderCreateProps, LabOrdersCreateFormInput, ParamsType } from "../../../../interfacesTypes";
import {
  ADD_ANOTHER_TEST, APPOINTMENT_TEXT, CREATE_LAB_ORDER, DIAGNOSES, EMPTY_MULTISELECT_OPTION, EMPTY_OPTION, 
  LAB_TEST_STATUSES, NOT_FOUND_EXCEPTION, REMOVE_TEST, SAVE_TEXT, STATUS, TEST, TEST_DATE, TEST_FIELD_INITIAL_VALUES, 
  TEST_NOTES, TEST_TIME, USER_NOT_FOUND_EXCEPTION_MESSAGE
} from '../../../../constants';
import { createLabOrdersSchema } from '../../../../validationSchemas';
import { LabTestStatus, useCreateLabTestMutation } from '../../../../generated/graphql';
import Alert from '../../../common/Alert';
import { generateString, getFormatDateString, renderItem, setRecord } from '../../../../utils';

const LabOrdersCreateForm: FC<LabOrderCreateProps> = ({ appointmentInfo, handleStep }): JSX.Element => {
  const methods = useForm<LabOrdersCreateFormInput>({
    mode: "all",
    defaultValues: {
      testField: [TEST_FIELD_INITIAL_VALUES],
      appointment: EMPTY_OPTION,
      diagnosesIds: [EMPTY_MULTISELECT_OPTION],
      labTestStatus: setRecord(LabTestStatus.OrderEntered, LabTestStatus.OrderEntered)
    },
    resolver: yupResolver(createLabOrdersSchema)
  });

  const { id: patientId } = useParams<ParamsType>()

  const { control, handleSubmit, reset } = methods

  const { fields: testFields, remove: removeTestField, append: appendTestField } = useFieldArray({ control: control, name: "testField" });

  const [createLabTest, { loading }] = useCreateLabTestMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },

    onCompleted(data) {
      if (data) {
        const { createLabTest } = data ?? {}
        const { labTest } = createLabTest ?? {}
        const { orderNumber } = labTest ?? {}
        Alert.success('Lab Orders Created Successfully');
        !appointmentInfo && handleStep && handleStep(1, orderNumber)
        reset()
      }
    }
  });

  const onSubmit: SubmitHandler<LabOrdersCreateFormInput> = async (values) => {
    const orderNumber = generateString()
    const accessionNumber = generateString(6)
    const { appointment, labTestStatus, diagnosesIds, testField } = values
    let appointmentId = ''
    if (appointmentInfo) {
      appointmentId = appointmentInfo.id
    } else {
      appointmentId = appointment?.id ?? ''
    }

    const { id: testStatus } = labTestStatus ?? {}

    testField.forEach(async (testFieldValues) => {
      const { test, testDate, testNotes, testTime, specimenTypeField } = testFieldValues

      const createLabTestItemInput = {
        patientId: patientId ?? '',
        ...(appointmentId && { appointmentId }),
        status: testStatus as LabTestStatus,
        testNotes,
        testDate: getFormatDateString(testDate, 'MM-DD-YYYY'),
        testTime,
        orderNumber,
        accessionNumber
      }

      const diagnoses = diagnosesIds.length ? diagnosesIds.map((diagnose) => diagnose.value) : undefined
      let createSpecimenItemInput

      if (specimenTypeField?.length) {
        createSpecimenItemInput = specimenTypeField.reduce((acc, specimenTypeFieldValues) => {
          const { collectionDate, collectionTime, specimenNotes, specimenType } = specimenTypeFieldValues
          const { id: testSpecimen } = specimenType
          acc.push({
            testSpecimen,
            specimenNotes,
            collectionDate: getFormatDateString(collectionDate, 'MM-DD-YYYY'),
            collectionTime
          })

          return acc
        }, [] as {
          testSpecimen: string,
          specimenNotes: string,
          collectionDate: string,
          collectionTime: string
        }[])
      }

      await createLabTest({
        variables: {
          createLabTestInput: {
            createLabTestItemInput,
            ...(createSpecimenItemInput && { createSpecimenItemInput }),
            ...(diagnoses && { diagnoses }),
            test: test.id
          }
        },
      });
    })
  }

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className='overflowVisible'>
            <Box px={2}>
              <Box py={2} mb={4} display='flex' justifyContent='space-between' alignItems='center' borderBottom={`1px solid ${colors.grey[300]}`}>
                <Typography variant='h4'>{CREATE_LAB_ORDER}</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item md={4} sm={12} xs={12}>
                  {appointmentInfo ? renderItem(APPOINTMENT_TEXT, appointmentInfo.name) :
                    <AppointmentSelector
                      label={APPOINTMENT_TEXT}
                      name="appointment"
                      addEmpty
                      patientId={patientId}
                    />}
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <Selector
                    isRequired
                    name="labTestStatus"
                    label={STATUS}
                    value={EMPTY_OPTION}
                    options={LAB_TEST_STATUSES}
                  />
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <DiagnosesSelector
                    isRequired
                    isEdit={false}
                    label={DIAGNOSES}
                    name="diagnosesIds"
                    defaultValues={[]}
                  />
                </Grid>
              </Grid>
            </Box>
          </Card>

          <Box p={2} />

          {testFields.map((_, index) => {
            return (
              <Box mb={4}>
                <Card>
                  <Box px={2}>
                    <Box py={2} mb={5} display='flex' justifyContent='space-between' alignItems='center' borderBottom={`1px solid ${colors.grey[300]}`}>
                      <Typography variant='h4'>{TEST}</Typography>

                      {!!(testFields.length > 1 && index !== 0) && <Button onClick={() => removeTestField(index)} type="submit" variant="outlined" color="inherit" className='danger'>
                        {REMOVE_TEST}
                      </Button>}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item md={6} sm={12} xs={12}>
                        <TestsSelector
                          isRequired
                          label={TEST}
                          name={`testField.${index}.test`}
                          addEmpty
                        />
                      </Grid>

                      <Grid item md={3} sm={12} xs={12}>
                        <DatePicker name={`testField.${index}.testDate`} label={TEST_DATE} disableFuture={false} />
                      </Grid>

                      <Grid item md={3} sm={12} xs={12}>
                        <TimePicker
                          label={TEST_TIME}
                          name={`testField.${index}.testTime`}
                        />
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
                        <LabOrdersSpecimenTypeForm index={index} />
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </Box>
            )
          })}

          <Box px={2} display='flex' justifyContent='flex-end'>
            <Button onClick={() => appendTestField(TEST_FIELD_INITIAL_VALUES)} type="submit" variant="outlined" color="secondary">
              {ADD_ANOTHER_TEST}
            </Button>
          </Box>

          <Box px={2}>
            <Button type="submit" variant="contained" color="primary" size='large' disabled={loading}>
              {SAVE_TEXT} {loading && <CircularProgress size={20} color="inherit" />}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </>
  );
};

export default LabOrdersCreateForm;
