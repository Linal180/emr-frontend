// packages block
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Box, Card, colors, Grid, Typography, Button, CircularProgress, FormGroup, FormControlLabel, Checkbox, } from "@material-ui/core";
//components block
import LabOrdersResultAttachment from './LabOrdersResultAttachment';
import LabOrdersResultSubForm from './LabOrdersResultSubForm';
import Alert from '../../../common/Alert';
// interfaces, graphql, constants block
import { GeneralFormProps, LabOrderResultsFormInput, ParamsType } from "../../../../interfacesTypes";
import {
  DESCRIPTION, DOCTOR_SIGNOFF, LOINC_CODE, NOT_FOUND_EXCEPTION, ORDERS_RESULT_INITIAL_VALUES, RESULTS, SAVE_TEXT, USER_NOT_FOUND_EXCEPTION_MESSAGE,
} from '../../../../constants';
import { GREY_THREE } from '../../../../theme';
import {
  AbnormalFlag, useFindLabTestsByOrderNumLazyQuery,
  useRemoveLabTestObservationMutation, useUpdateLabTestObservationMutation
} from '../../../../generated/graphql';
import history from '../../../../history';

const LabOrdersResultForm: FC<GeneralFormProps> = (): JSX.Element => {
  const { orderNum, patientId } = useParams<ParamsType>();
  const [resultsToRemove, setResultsToRemove] = useState<string[]>([])
  const [doctorSignOff, setDoctorSignOff] = useState(false);

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
          doctorsSignOff: doctorSignOff
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
            const { normalRange, resultUnit, resultValue, normalRangeUnit, abnormalFlag, id, doctorsSignOff } = testObservation ?? {}

            setDoctorSignOff(doctorsSignOff || false)

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

  const handleDoctorSignOffToggle = (
    {target: { checked }}: ChangeEvent<HTMLInputElement>
  ) => {
    setDoctorSignOff(checked);
  };

  return (
    <>
      <Card>
        <Box m={3}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox color="primary" checked={doctorSignOff} onChange={handleDoctorSignOffToggle} />
              }
              label={DOCTOR_SIGNOFF}
            />
          </FormGroup>
        </Box>
        <Box px={3}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box py={2} mb={4} borderBottom={`1px solid ${colors.grey[300]}`}>
                <Typography variant='h4'>{RESULTS}</Typography>
              </Box>

              <Grid container spacing={3}>
                {resultFields?.map((resultField, index) => {
                  return (
                    <Grid item container spacing={3}>
                      <Grid item md={12}>
                        <Grid container spacing={3}>
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
                      </Grid>

                      <LabOrdersResultSubForm index={index} setResultsToRemove={setResultsToRemove} />
                    </Grid>
                  )
                })
                }
              </Grid>

              <Box mb={3}>
                <Button type="submit" variant="contained" color="primary" disabled={removeLoading || updateLoading}>
                  {SAVE_TEXT} {(removeLoading || updateLoading) && <CircularProgress size={20} color="inherit" />}
                </Button>
              </Box>
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
