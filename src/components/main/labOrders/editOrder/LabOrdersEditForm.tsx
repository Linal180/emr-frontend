// packages block
import { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Box, Card, colors, Grid, Typography, Button, CircularProgress } from "@material-ui/core";
// components block
import Alert from '../../../common/Alert';
import Selector from '../../../common/Selector';
import TimePicker from '../../../common/TimePicker';
import DatePicker from '../../../common/DatePicker';
import InputController from '../../../../controller';
import TestsSelector from '../../../common/Selector/TestSelector';
import DiagnosesSelector from '../../../common/Selector/DiagnosesSelector';
import LabOrdersSpecimenTypeForm from '../addOrder/LabOrdersSpecimenTypeForm';
import AppointmentSelector from '../../../common/Selector/AppointmentSelector';
// interfaces, graphql, constants block
import history from '../../../../history';
import { createLabOrdersSchema } from '../../../../validationSchemas';
import { convertDateFromUnix, formatValue, getFormatDateString } from '../../../../utils';
import {
  GeneralFormProps, LabOrdersCreateFormInput, multiOptionType, ParamsType
} from "../../../../interfacesTypes";
import {
  LabTestStatus, useCreateLabTestMutation, useFindLabTestsByOrderNumLazyQuery, useRemoveLabTestMutation,
  useUpdateLabTestMutation
} from '../../../../generated/graphql';
import {
  ADD_ANOTHER_TEST, APPOINTMENT_TEXT, DIAGNOSES, EDIT_LAB_ORDER, EMPTY_OPTION, LAB_TEST_STATUSES,
  NOT_FOUND_EXCEPTION, REMOVE_TEST, SAVE_TEXT, SOMETHING_WENT_WRONG, STATUS, TEST, TEST_DATE, TEST_FIELD_INITIAL_VALUES,
  TEST_NOTES, TEST_TIME, USER_NOT_FOUND_EXCEPTION_MESSAGE
} from '../../../../constants';

const LabOrdersEditForm: FC<GeneralFormProps> = (): JSX.Element => {
  const { orderNum, patientId } = useParams<ParamsType>();
  const [testsToRemove, setTestsToRemove] = useState<string[]>([])
  const [accessionNumber, setAccessionNumber] = useState<string>('')
  const [diagnosesIds, setDiagnosesIds] = useState<multiOptionType[]>([])

  const methods = useForm<LabOrdersCreateFormInput>({
    mode: "all",
    resolver: yupResolver(createLabOrdersSchema)
  });
  const { control, handleSubmit, setValue } = methods

  const [findLabTestsByOrderNum, { loading, error }] = useFindLabTestsByOrderNumLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(`/patients/${patientId}/details/10`)
    },

    onCompleted(data) {
      const { findLabTestsByOrderNum } = data || {};

      if (findLabTestsByOrderNum) {
        const { labTests } = findLabTestsByOrderNum

        const { labTestStatus, diagnoses, appointment, accessionNumber } = labTests?.[0] ?? {}
        const transformedDiagnoses = diagnoses?.map((diagnose) => {
          return {
            value: diagnose?.id ?? '',
            label: `${diagnose?.code ?? ''} | ${diagnose?.description ?? ''}`
          }
        }) ?? []

        labTestStatus && setValue('labTestStatus', {
          id: labTestStatus,
          name: formatValue(labTestStatus)
        })
        diagnoses && setDiagnosesIds(transformedDiagnoses)
        appointment && setValue('appointment', {
          id: appointment.id,
          name: `${appointment.appointmentType?.name} ${convertDateFromUnix(appointment.scheduleStartDateTime, 'MM-DD-YYYY hh:mm:ss')}`
        })

        setAccessionNumber(accessionNumber || '')

        const transformedLabTests = labTests?.map((labTest) => {
          const { test, testNotes, testTime, testDate, testSpecimens, id: testId, diagnoses } = labTest ?? {}
          const { id, loincNum, component } = test ?? {}

          const transformedTestSpecimens = testSpecimens?.map((testSpecimen) => {
            const { collectionDate, collectionTime, specimenTypes, specimenNotes, id: specimenId } = testSpecimen ?? {}
            const { id, name } = specimenTypes ?? {}

            return {
              id: specimenId,
              specimenType: {
                id: id ?? '',
                name
              },
              collectionDate: collectionDate ?? '',
              collectionTime: collectionTime ?? '',
              specimenNotes: specimenNotes ?? ''
            }
          }) ?? []

          return {
            testId: testId,
            test: {
              id: id ?? '',
              name: `${loincNum} | ${component}`
            },

            testDate: testDate ?? '',
            testTime: testTime ?? '',
            testNotes: testNotes ?? '',
            specimenTypeField: transformedTestSpecimens,
            diagnosesIds: diagnoses?.map((value) => {
              return {
                label: `${value?.code} | ${value?.description}`,
                value: value?.id || ''
              }
            }) ?? []
          }
        }) ?? []

        setValue('testFieldValues', transformedLabTests)
      }
    }
  });

  const fetchLabTests = useCallback(async () => {
    try {
      orderNum ? await findLabTestsByOrderNum({
        variables: {
          labTestByOrderNumInput: {
            orderNumber: orderNum
          }
        }
      }) : Alert.error(SOMETHING_WENT_WRONG)
    } catch (error) { }
  }, [findLabTestsByOrderNum, orderNum])

  useEffect(() => {
    fetchLabTests()
  }, [fetchLabTests])

  const [createLabTest, { loading: createLoading }] = useCreateLabTestMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        : Alert.error(message)
    },
  });

  const [removeLabTest, { loading: removeLoading }] = useRemoveLabTestMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        : Alert.error(message)
    },
  });

  const [updateLabTest, { loading: updateLoading }] = useUpdateLabTestMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        : Alert.error(message)
    },

    onCompleted() {
      history.push(`/patients/${patientId}/details/10`)
    }
  });

  // const { fields: testFields, remove: removeTestField, append: appendTestField } =
  //   useFieldArray({ control: control, name: "testField" });
  const { fields: testFieldValues, remove: removeTestField, append: appendTestField } = useFieldArray({ control: control, name: "testFieldValues" });

  const handleTestCreation = (values: LabOrdersCreateFormInput) => {
    const { appointment, labTestStatus, diagnosesIds, testFieldValues } = values
    const { id: appointmentId } = appointment ?? {}
    const { id: testStatus } = labTestStatus ?? {}

    testFieldValues.forEach(async (testFieldValue) => {
      const { test, testDate, testNotes, testTime, specimenTypeField } = testFieldValue

      const createLabTestItemInput = {
        patientId: patientId ?? '',
        ...(appointmentId && { appointmentId }),
        status: testStatus as LabTestStatus, testNotes, testTime,
        testDate: getFormatDateString(testDate, 'MM-DD-YYYY'),
        orderNumber: orderNum, accessionNumber: accessionNumber
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

  const onSubmit: SubmitHandler<LabOrdersCreateFormInput> = async (values) => {
    if (testsToRemove.length) {
      testsToRemove.forEach(async (testToRemove) => {
        await removeLabTest({
          variables: {
            removeLabTest: {
              id: testToRemove
            }
          }
        })
      })
    }

    const { appointment, labTestStatus, diagnosesIds, testFieldValues } = values
    const { id: appointmentId } = appointment ?? {}
    const { id: testStatus } = labTestStatus ?? {}

    const newTests = testFieldValues.filter((testFieldValue) => !!testFieldValue?.newTest)
    const oldTests = testFieldValues.filter((testFieldValue) => !testFieldValue?.newTest)

    if (newTests.length) {
      handleTestCreation({ ...values, testFieldValues: newTests })
    }



    oldTests.forEach(async (testFieldValues) => {
      const { test, testDate, testNotes, testTime, specimenTypeField, testId } = testFieldValues

      const updateLabTestItemInput = {
        patientId: patientId ?? '',
        ...(appointmentId && { appointmentId }),
        status: testStatus as LabTestStatus,
        testNotes, testTime, id: testId ?? '',
        testDate: getFormatDateString(testDate, 'MM-DD-YYYY'),
      }

      const diagnoses = diagnosesIds.length ? diagnosesIds.map((diagnose) => diagnose.value) : undefined
      let updateSpecimenItemInput

      if (specimenTypeField?.length) {
        updateSpecimenItemInput = specimenTypeField.reduce((acc, specimenTypeFieldValues) => {
          const { collectionDate, collectionTime, specimenNotes, specimenType, id: specimenId } = specimenTypeFieldValues
          const { id: testSpecimen } = specimenType
          acc.push({
            id: specimenId ?? '',
            testSpecimen, specimenNotes, collectionTime,
            collectionDate: getFormatDateString(collectionDate, 'MM-DD-YYYY'),
          })

          return acc
        }, [] as {
          id: string,
          testSpecimen: string,
          specimenNotes: string,
          collectionDate: string,
          collectionTime: string
        }[])
      }

      await updateLabTest({
        variables: {
          updateLabTestInput: {
            updateLabTestItemInput,
            ...(updateSpecimenItemInput && { updateSpecimenItemInput }),
            ...(diagnoses && { diagnoses }),
            test: test.id
          }
        },
      });
    })
  }

  return (
    <Box mt={4}>
      {(!loading || error) && (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className='overflowVisible'>
              <Box p={2}>
                <Box py={2} mb={4} display='flex' justifyContent='space-between'
                  alignItems='center' borderBottom={`1px solid ${colors.grey[300]}`}
                >
                  <Typography variant='h4'>{EDIT_LAB_ORDER}</Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item md={5} sm={12} xs={12}>
                    <AppointmentSelector
                      addEmpty
                      disabled
                      name="appointment"
                      patientId={patientId}
                      label={APPOINTMENT_TEXT}
                    />
                  </Grid>

                  <Grid item md={3} sm={12} xs={12}>
                    <Selector
                      name="labTestStatus"
                      label={STATUS}
                      value={EMPTY_OPTION}
                      options={LAB_TEST_STATUSES}
                    />
                  </Grid>

                  <Grid item md={4} sm={12} xs={12}>
                    <DiagnosesSelector
                      isEdit={true}
                      label={DIAGNOSES}
                      name="diagnosesIds"
                      defaultValues={diagnosesIds}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Card>

            <Box p={2} />

            {testFieldValues.map((testField, index) => {
              return (
                <Box mb={4}>
                  <Card>
                    <Box p={2}>
                      <Box py={2} mb={5} display='flex' justifyContent='space-between'
                        alignItems='center' borderBottom={`1px solid ${colors.grey[300]}`}
                      >
                        <Typography variant='h4'>{TEST}</Typography>

                        {!!(testFieldValues.length > 1 && index !== 0) && <Button onClick={() => {
                          setTestsToRemove([...testsToRemove, testField?.testId ?? ''])
                          removeTestField(index)
                        }} type="submit" variant="outlined" color="inherit" className='danger'>
                          {REMOVE_TEST}
                        </Button>}
                      </Box>

                      <Grid container item spacing={3}>
                        <Grid item md={6} sm={12} xs={12}>
                          <TestsSelector
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
                            isRequired
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

            <Box display='flex' justifyContent='flex-end'>
              <Button onClick={() => appendTestField({ ...TEST_FIELD_INITIAL_VALUES, newTest: true })}
                type="submit" variant="outlined" color="secondary"
              >
                {ADD_ANOTHER_TEST}
              </Button>
            </Box>

            <Button type="submit" variant="contained" color="primary"
              disabled={createLoading || updateLoading || removeLoading}
            >
              {SAVE_TEXT} {(createLoading || updateLoading) && <CircularProgress size={20} color="inherit" />}
            </Button>
          </form>
        </FormProvider>)}
    </Box>
  );
};

export default LabOrdersEditForm;
