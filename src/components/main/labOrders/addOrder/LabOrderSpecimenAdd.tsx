// packages block
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, CircularProgress, colors, Grid, Typography } from "@material-ui/core";
import { FC, useCallback, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
// components block
import InputController from '../../../../controller';
import Alert from '../../../common/Alert';
import DatePicker from '../../../common/DatePicker';
import Loader from '../../../common/Loader';
import TestsSelector from '../../../common/Selector/TestSelector';
import TimePicker from '../../../common/TimePicker';
import LabOrdersSpecimenTypeForm from './LabOrdersSpecimenTypeForm';
// interfaces, graphql, constants block
import {
  LAB_SPECIMEN, NOT_FOUND_EXCEPTION, SAVE_TEXT, SOMETHING_WENT_WRONG, TEST, TEST_DATE, TEST_NOTES, TEST_TIME, USER_NOT_FOUND_EXCEPTION_MESSAGE
} from '../../../../constants';
import {
  LabTestStatus, useGetLabTestLazyQuery, useUpdateLabTestMutation
} from '../../../../generated/graphql';
import history from '../../../../history';
import {
  GeneralFormProps, LabOrdersCreateFormInput, ParamsType
} from "../../../../interfacesTypes";
import { convertDateFromUnix, formatValue, getFormatDateString } from '../../../../utils';
import { createLabOrdersSchema } from '../../../../validationSchemas';
import BackButton from '../../../common/BackButton';
import PageHeader from '../../../common/PageHeader';

const LabOrderSpecimenAdd: FC<GeneralFormProps> = (): JSX.Element => {
  const { patientId, testId } = useParams<ParamsType>();
  const [isLoading, setIsLoading] = useState(true)

  const methods = useForm<LabOrdersCreateFormInput>({
    mode: "all",
    resolver: yupResolver(createLabOrdersSchema(true))
  });
  const { control, handleSubmit, setValue } = methods

  const [getLabTest, { loading, error }] = useGetLabTestLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(`/patients/${patientId}/details/1`)
    },

    onCompleted(data) {
      const { getLabTest } = data || {};

      if (getLabTest) {
        const { labTest } = getLabTest

        const { labTestStatus, diagnoses, appointment, test, testNotes, testTime, testDate, testSpecimens, id: testId } = labTest ?? {}
        const { id, loincNum, component } = test ?? {}

        labTestStatus && setValue('labTestStatus', {
          id: labTestStatus,
          name: formatValue(labTestStatus)
        })
        appointment && setValue('appointment', {
          id: appointment.id,
          name: `${appointment.appointmentType?.name} ${convertDateFromUnix(appointment.scheduleStartDateTime, 'MM-DD-YYYY hh:mm:ss')}`
        })

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

        const transformedLabTest = [{
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
        }]

        setValue('testFieldValues', transformedLabTest)
        setIsLoading(false)
      }
    }
  });

  const fetchLabTests = useCallback(async () => {
    try {
      testId ? await getLabTest({
        variables: {
          getLabTest: {
            id: testId
          }
        }
      }) : Alert.error(SOMETHING_WENT_WRONG)
    } catch (error) { }
  }, [getLabTest, testId])

  useEffect(() => {
    fetchLabTests()
  }, [fetchLabTests])

  const [updateLabTest, { loading: updateLoading }] = useUpdateLabTestMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        : Alert.error(message)
    },

    onCompleted() {
      history.push(`/patients/${patientId}/details/1`)
    }
  });

  const { fields: testFieldValues } = useFieldArray({ control: control, name: "testFieldValues" });

  const onSubmit: SubmitHandler<LabOrdersCreateFormInput> = async (values) => {
    const { appointment, labTestStatus, diagnosesIds, testFieldValues } = values
    const { id: appointmentId } = appointment ?? {}
    const { id: testStatus } = labTestStatus ?? {}

    testFieldValues.forEach(async (testFieldValues) => {
      const { test, testDate, testNotes, testTime, specimenTypeField, testId } = testFieldValues

      const updateLabTestItemInput = {
        patientId: patientId ?? '',
        ...(appointmentId && { appointmentId }),
        status: testStatus as LabTestStatus,
        testNotes, testTime, id: testId ?? '',
        testDate: getFormatDateString(testDate, 'MM-DD-YYYY'),
      }

      const diagnoses = diagnosesIds?.length ? diagnosesIds.map((diagnose) => diagnose.value) : undefined
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

  if (isLoading) {
    return <Loader loading loaderText='Fetching Order...' />
  }

  return (
    <>
      <Box display="flex">
        <BackButton to={`/patients/${patientId}/details/1`} />

        <Box ml={2}>
          <PageHeader
            title={testFieldValues?.[0].test.name || ''}
            subTitle={LAB_SPECIMEN}
          />
        </Box>
      </Box>
      <Box mt={4}>

        {(!loading || error) && (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box p={2} />

              {testFieldValues.map((_, index) => {
                return (
                  <Box mb={4}>
                    <Card>
                      <Box p={2}>
                        <Box py={2} mb={5} display='flex' justifyContent='space-between'
                          alignItems='center' borderBottom={`1px solid ${colors.grey[300]}`}
                        >
                          <Typography variant='h4'>{TEST}</Typography>
                        </Box>

                        <Grid container item spacing={3}>
                          <Grid item md={6} sm={12} xs={12}>
                            <TestsSelector
                              label={TEST}
                              name={`testFieldValues.${index}.test`}
                              disabled
                              addEmpty
                            />
                          </Grid>

                          <Grid item md={3} sm={12} xs={12}>
                            <DatePicker name={`testFieldValues.${index}.testDate`} label={TEST_DATE} disableFuture={false} disabled />
                          </Grid>

                          <Grid item md={3} sm={12} xs={12}>
                            <TimePicker
                              isRequired
                              label={TEST_TIME}
                              name={`testFieldValues.${index}.testTime`}
                              disabled
                            />
                          </Grid>

                          <Grid item md={12} sm={12} xs={12}>
                            <InputController
                              multiline
                              fieldType="text"
                              controllerName={`testFieldValues.${index}.testNotes`}
                              controllerLabel={TEST_NOTES}
                              disabled
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

              <Button type="submit" variant="contained" color="primary"
                disabled={updateLoading}
              >
                {SAVE_TEXT} {(updateLoading) && <CircularProgress size={20} color="inherit" />}
              </Button>
            </form>
          </FormProvider>)}
      </Box>
    </>
  );
};

export default LabOrderSpecimenAdd;
