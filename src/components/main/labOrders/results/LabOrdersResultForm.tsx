// packages block
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { 
  Box, Card, colors, Grid, Typography, Button, CircularProgress, FormGroup, FormControlLabel, Checkbox, 
} from "@material-ui/core";
//components block
import LabOrdersResultAttachment from './LabOrdersResultAttachment';
import LabOrdersResultSubForm from './LabOrdersResultSubForm';
import Alert from '../../../common/Alert';
// interfaces, graphql, constants block
import { GeneralFormProps, LabOrderResultsFormInput, ParamsType } from "../../../../interfacesTypes";
import {
  ACCESSION_NUMBER, COLLECTED_DATE, DESCRIPTION, DOCTOR_SIGNOFF, EMPTY_OPTION, LAB_TEXT, LOINC_CODE, 
  NOT_FOUND_EXCEPTION, ORDERS_RESULT_INITIAL_VALUES, ORDER_NUMBER, OTHER_OPTION, RECEIVED_DATE, RESULTS, SAVE_TEXT, TESTS, 
  USER_NOT_FOUND_EXCEPTION_MESSAGE, VENDOR_NAME,
} from '../../../../constants';
import { GREY, GREY_THREE } from '../../../../theme';
import {
  AbnormalFlag, useFindLabTestsByOrderNumLazyQuery,
  useRemoveLabTestObservationMutation, useUpdateLabTestMutation, useUpdateLabTestObservationMutation
} from '../../../../generated/graphql';
import history from '../../../../history';
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
import DatePicker from '../../../common/DatePicker';
import { getFormatDateString, renderItem } from '../../../../utils';
import { PatientProviderSelector } from '../../../common/Selector/PatientProviderSelector';

const LabOrdersResultForm: FC<GeneralFormProps> = (): JSX.Element => {
  const { orderNum, patientId } = useParams<ParamsType>();
  const [resultsToRemove, setResultsToRemove] = useState<string[]>([])
  const [doctorSignOff, setDoctorSignOff] = useState(false);

  const methods = useForm<LabOrderResultsFormInput>({
    mode: "all",
  });

  const [updateLabTest] = useUpdateLabTestMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },
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
    const { assignedProvider, accessionNumber, collectedDate, receivedDate, labName, venderName }= values ?? {}

    console.log("values",values)

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

      await updateLabTest({
        variables: {
          updateLabTestInput: {
            updateLabTestItemInput: {
              id: testId ?? '',
              patientId: patientId ?? '',
              collectedDate: getFormatDateString(collectedDate, 'MM-DD-YYYY'),
              receivedDate: getFormatDateString(receivedDate, 'MM-DD-YYYY'),
              accessionNumber: accessionNumber,
              labName: labName?.id ?? '',
              vendorName: venderName ?? '',
              ...(assignedProvider?.id && {doctorId: assignedProvider?.id ?? ''})
            },
          }
        }
      })

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
          const { test, id, testObservations, doctor, vendorName, collectedDate, receivedDate, accessionNumber, labName, } = labTest ?? {}
          const { component, loincNum, unitsRequired } = test ?? {}

          setValue('labName', {
            id: labName ?? '',
            name: labName ?? ''
          })
          setValue('accessionNumber', accessionNumber ?? '')
          setValue('assignedProvider', {
            id: doctor?.id ?? '',
            name: `${doctor?.firstName ?? ''} ${doctor?.lastName ?? ''}`.trim()
          })
          setValue('venderName', vendorName ?? '')
          setValue('collectedDate', collectedDate ?? '')
          setValue('receivedDate', receivedDate ?? '')

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
    { target: { checked } }: ChangeEvent<HTMLInputElement>
  ) => {
    setDoctorSignOff(checked);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <Box px={3}>
              <Box py={2} mb={4} borderBottom={`1px solid ${colors.grey[300]}`} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant='h4'>{RESULTS}</Typography>

                <Button type="submit" variant="contained" color="primary" disabled={removeLoading || updateLoading}>
                  {SAVE_TEXT} {(removeLoading || updateLoading) && <CircularProgress size={20} color="inherit" />}
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item md={3} sm={12} xs={12}>
                  <Selector
                    name="labName"
                    label={LAB_TEXT}
                    value={EMPTY_OPTION}
                    options={[EMPTY_OPTION,OTHER_OPTION]}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <PatientProviderSelector patientId={patientId ?? ''}/>
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="accessionNumber"
                    controllerLabel={ACCESSION_NUMBER}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="venderName"
                    controllerLabel={VENDOR_NAME}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                 {renderItem(ORDER_NUMBER, orderNum)}
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <DatePicker name="collectedDate" label={COLLECTED_DATE} />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <DatePicker name="receivedDate" label={RECEIVED_DATE} />
                </Grid>
              </Grid>
            </Box>
          </Card>

          <Box p={2} />

          <Card>
            <Box px={3}>
              <Box py={2} mb={4} borderBottom={`1px solid ${colors.grey[300]}`}>
                <Typography variant='h4'>{TESTS}</Typography>
              </Box>

              <Box mb={2}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox color="primary" checked={doctorSignOff} onChange={handleDoctorSignOffToggle} />
                    }
                    label={DOCTOR_SIGNOFF}
                  />
                </FormGroup>
              </Box>

              <Grid container spacing={3}>
                {resultFields?.map((resultField, index) => {
                  return (
                    <Box mb={2} borderBottom={(resultFields.length - 1) === index ? 'none' : `2px solid ${GREY}`} key={index}>
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
            </Box>
          </Card>
        </form>
      </FormProvider>

      <Box p={2} />

      <LabOrdersResultAttachment />
    </>
  );
};

export default LabOrdersResultForm;
