// packages block
import { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Box, Card, colors, Grid, Typography, Button, CircularProgress, } from "@material-ui/core";
//components block
import LabOrdersResultAttachment from './LabOrdersResultAttachment';
import LabOrdersResultSubForm from './LabOrdersResultSubForm';
import Alert from '../../../common/Alert';
// interfaces, graphql, constants block
import { GeneralFormProps, LabOrderResultsFormInput, ParamsType } from "../../../../interfacesTypes";
import {
  ACCESSION_NUMBER,
  ASSIGNED_PROVIDER,
  COLLECTED_DATE,
  DESCRIPTION, EMPTY_OPTION, LAB_TEXT, LOINC_CODE, NOT_FOUND_EXCEPTION, ORDERS_RESULT_INITIAL_VALUES, ORDER_NUMBER, RECEIVED_DATE, RESULTS, SAVE_TEXT, TESTS, USER_NOT_FOUND_EXCEPTION_MESSAGE, VENDOR_NAME,
} from '../../../../constants';
import { GREY, GREY_THREE } from '../../../../theme';
import {
  AbnormalFlag, useFindLabTestsByOrderNumLazyQuery,
  useRemoveLabTestObservationMutation, useUpdateLabTestObservationMutation
} from '../../../../generated/graphql';
import history from '../../../../history';
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
import DatePicker from '../../../common/DatePicker';

const LabOrdersResultForm: FC<GeneralFormProps> = (): JSX.Element => {
  const { orderNum, patientId } = useParams<ParamsType>();
  const [resultsToRemove, setResultsToRemove] = useState<string[]>([])

  const methods = useForm<LabOrderResultsFormInput>({
    mode: "all",
  });

  const [updateLabTestObservation, { loading: updateLoading }] = useUpdateLabTestObservationMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },

    onCompleted() {
      history.push(`/patients/${patientId}/details/10`)
    }
  });

  const [removeLabTestMutation, { loading: removeLoading }] = useRemoveLabTestObservationMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },
  });

  const { handleSubmit, setValue, control } = methods;

  const onSubmit: SubmitHandler<LabOrderResultsFormInput> = async (values) => {
    if (resultsToRemove.length) {
      resultsToRemove.forEach(async (resultId) => {
        await removeLabTestMutation({
          variables: {
            removeLabTestObservation: {
              id: resultId ?? ''
            }
          }
        })
      })
    }

    values.loinsCodeFields.forEach(async (loinsCodeField) => {
      const { testId, description, resultsField } = loinsCodeField ?? {}

      const transformedObservations = resultsField.map((resultsFieldValues) => {
        const { abnormalFlag, normalRange, normalRangeUnits, observationId, resultUnits, resultValue } = resultsFieldValues ?? {}

        return {
          id: observationId ?? '',
          ...(abnormalFlag?.id && { abnormalFlag: abnormalFlag?.id as AbnormalFlag }),
          description,
          normalRange,
          normalRangeUnit: normalRangeUnits,
          resultUnit: resultUnits,
          resultValue: resultValue,
        }
      })

      await updateLabTestObservation({
        variables: {
          updateLabTestObservationInput: {
            updateLabTestObservationItemInput: transformedObservations,
            labTestId: testId
          }
        }
      })
    })
  }

  const { fields: resultFields } = useFieldArray({ control: control, name: "loinsCodeFields" });

  const [findLabTestsByOrderNum] = useFindLabTestsByOrderNumLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(`/patients/${patientId}/details/10`)
    },

    async onCompleted(data) {
      const { findLabTestsByOrderNum } = data || {};

      if (findLabTestsByOrderNum) {
        const { labTests } = findLabTestsByOrderNum

        const transformedLabTests = labTests?.map((labTest) => {
          const { test, id, testObservations } = labTest ?? {}
          const { component, loincNum, unitsRequired } = test ?? {}

          const transformedObservations = testObservations?.map((testObservation) => {
            const { normalRange, resultUnit, resultValue, normalRangeUnit, abnormalFlag, id } = testObservation ?? {}

            return {
              observationId: id,
              resultValue: resultValue ?? '',
              resultUnits: resultUnit ?? unitsRequired ?? '',
              normalRange: normalRange ?? '',
              normalRangeUnits: normalRangeUnit ?? '',
              abnormalFlag: {
                id: abnormalFlag ?? '',
                name: abnormalFlag ?? ''
              }
            }
          })

          return {
            testId: id ?? '',
            loinccode: loincNum ?? '',
            description: component ?? '',
            resultsField: transformedObservations?.length ? transformedObservations : [{ ...ORDERS_RESULT_INITIAL_VALUES, resultUnits: unitsRequired ?? '' }]
          }
        }) ?? []

        setValue('loinsCodeFields', transformedLabTests)
      }
    }
  });

  const fetchlabTests = useCallback(async () => {
    try {
      await findLabTestsByOrderNum({
        variables: {
          labTestByOrderNumInput: {
            orderNumber: orderNum ?? ''
          }
        }
      });
    } catch (error) { }
  }, [findLabTestsByOrderNum, orderNum])

  useEffect(() => {
    fetchlabTests()
  }, [fetchlabTests])

  return (
    <>
      <Card>
        <Box p={3}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box py={2} mb={4} borderBottom={`1px solid ${colors.grey[300]}`}>
                <Typography variant='h4'>{RESULTS}</Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item md={3} sm={12} xs={12}>
                  <Selector
                    name="lab"
                    label={LAB_TEXT}
                    value={EMPTY_OPTION}
                    options={[]}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <Selector
                    name="assignedProvider"
                    label={ASSIGNED_PROVIDER}
                    value={EMPTY_OPTION}
                    options={[]}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName={''}
                    controllerLabel={ACCESSION_NUMBER}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName={''}
                    controllerLabel={VENDOR_NAME}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName={''}
                    controllerLabel={ORDER_NUMBER}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <DatePicker name={''} label={COLLECTED_DATE} />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <DatePicker name={''} label={RECEIVED_DATE} />
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Box>
      </Card>

      <Box p={2} />

      <Card>
        <Box px={3}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box py={2} mb={4} borderBottom={`1px solid ${colors.grey[300]}`} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant='h4'>{TESTS}</Typography>

                <Button type="submit" variant="contained" color="primary" disabled={removeLoading || updateLoading}>
                  {SAVE_TEXT} {(removeLoading || updateLoading) && <CircularProgress size={20} color="inherit" />}
                </Button>
              </Box>

              <Grid container spacing={3}>
                {resultFields?.map((resultField, index) => {
                  return (
                    <Box mb={2} borderBottom={(resultFields.length - 1) === index ? 'none' : `2px solid ${GREY}`}>
                      <Grid container spacing={3}>
                        <Grid item md={12}>
                          <Box p={1.5} display='flex'>
                            <Grid container>
                              <Grid item md={4}>
                                <Typography variant='h6'>{LOINC_CODE}</Typography>

                                <Box py={0.6} mb={2} color={GREY_THREE}>
                                  <Typography variant='body1'>{resultField.loinccode}</Typography>
                                </Box>
                              </Grid>

                              <Grid item md={8}>
                                <Typography variant='h6'>{DESCRIPTION}</Typography>

                                <Box py={0.6} mb={2} color={GREY_THREE}>
                                  <Typography variant='body1'>{resultField.description}</Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>

                        <Grid item md={12}>
                          <LabOrdersResultSubForm index={index} setResultsToRemove={setResultsToRemove} />
                        </Grid>
                      </Grid>
                    </Box>
                  )
                })
                }
              </Grid>
            </form>
          </FormProvider>
        </Box>
      </Card>

      <Box p={2} />

      <LabOrdersResultAttachment />
    </>
  );
};

export default LabOrdersResultForm;
